'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, type DbStep, type DbField } from './lib/supabase'
import { steps as fallbackSteps } from './data'

type Step = {
  id: string
  number: number
  title: string
  subtitle: string
  description: string
  icon: string
  fields: Field[]
}

type Field = {
  id: string
  label: string
  hint: string
  type: string
  options?: string[]
  placeholder?: string
}

const STORAGE_KEY = 'concept-worksheet-data'

export default function Home() {
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loaded, setLoaded] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  // DBからステップ・フィールドを読み込み
  useEffect(() => {
    async function load() {
      const [{ data: dbSteps }, { data: dbFields }] = await Promise.all([
        supabase.from('ws_steps').select('*').order('number'),
        supabase.from('ws_fields').select('*').order('sort_order'),
      ])

      if (dbSteps && dbSteps.length > 0 && dbFields) {
        const mapped: Step[] = (dbSteps as DbStep[]).map(s => ({
          id: s.id,
          number: s.number,
          title: s.title,
          subtitle: s.subtitle || '',
          description: s.description || '',
          icon: s.icon,
          fields: (dbFields as DbField[])
            .filter(f => f.step_id === s.id)
            .map(f => ({
              id: f.field_key,
              label: f.label,
              hint: f.hint || '',
              type: f.field_type,
              options: f.options || undefined,
              placeholder: f.placeholder || undefined,
            })),
        }))
        setSteps(mapped)
      } else {
        // DB接続失敗時はフォールバック
        setSteps(fallbackSteps.map(s => ({
          ...s,
          fields: s.fields.map(f => ({ ...f, type: f.type })),
        })))
      }
      setDataLoaded(true)
    }
    load()
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setAnswers(JSON.parse(saved))
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
    }
  }, [answers, loaded])

  const updateAnswer = useCallback((fieldId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }))
  }, [])

  const getStepProgress = useCallback((step: Step) => {
    const filled = step.fields.filter(f => (answers[f.id] || '').trim().length > 0).length
    return { filled, total: step.fields.length, percent: step.fields.length > 0 ? Math.round((filled / step.fields.length) * 100) : 0 }
  }, [answers])

  const getTotalProgress = useCallback(() => {
    const allFields = steps.flatMap(s => s.fields)
    const filled = allFields.filter(f => (answers[f.id] || '').trim().length > 0).length
    return { filled, total: allFields.length, percent: allFields.length > 0 ? Math.round((filled / allFields.length) * 100) : 0 }
  }, [answers, steps])

  if (!dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-gray-900 rounded-full mx-auto"></div>
          <p className="text-sm text-gray-400 mt-3">読み込み中...</p>
        </div>
      </div>
    )
  }

  const activeStep = currentStep !== null ? steps[currentStep] : null

  // トップ画面
  if (currentStep === null) {
    const total = getTotalProgress()

    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="max-w-2xl mx-auto px-4 py-10 md:py-14 text-center">
            <p className="text-xs text-slate-400 tracking-widest uppercase mb-3">for 治療家・セラピスト</p>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">商品コンセプト設計<br />ワークシート</h1>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">9つのステップで、あなたの院だけの<br />「選ばれる商品」を設計する</p>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8 flex-1 w-full">
          {total.filled > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 text-center">
              <p className="text-xs text-gray-400 mb-1">全体の記入率</p>
              <p className="text-3xl font-bold text-gray-900">{total.percent}<span className="text-lg text-gray-400">%</span></p>
              <p className="text-xs text-gray-400 mt-1">{total.filled} / {total.total} 項目を記入済み</p>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-3">
                <div className="h-full rounded-full bg-gradient-to-r from-slate-600 to-slate-900 transition-all duration-500" style={{ width: `${total.percent}%` }} />
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500 mb-6 text-center">
            {total.filled === 0 ? 'Step 1から順番に進めていきましょう' : '途中からでも再開できます'}
          </p>

          <div className="space-y-3">
            {steps.map((step, index) => {
              const progress = getStepProgress(step)
              return (
                <button
                  key={step.id}
                  onClick={() => { setCurrentStep(index); window.scrollTo({ top: 0 }) }}
                  className="w-full text-left bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                      progress.percent === 100 ? 'bg-green-100 text-green-700'
                        : progress.filled > 0 ? 'bg-slate-100 text-slate-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {progress.percent === 100 ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-400">STEP {step.number}</p>
                        {progress.filled > 0 && progress.percent < 100 && (
                          <span className="text-[10px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded">{progress.filled}/{progress.total}</span>
                        )}
                      </div>
                      <p className="font-bold text-gray-900 text-sm">{step.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{step.subtitle}</p>
                    </div>
                    <span className="text-gray-300 shrink-0">→</span>
                  </div>
                  {progress.filled > 0 && (
                    <div className="mt-3 ml-14">
                      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${progress.percent === 100 ? 'bg-green-500' : 'bg-slate-400'}`} style={{ width: `${progress.percent}%` }} />
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {total.filled > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  if (confirm('すべての記入内容をリセットしますか？')) {
                    setAnswers({})
                    localStorage.removeItem(STORAGE_KEY)
                  }
                }}
                className="text-xs text-gray-300 hover:text-red-400 transition-colors"
              >
                すべてリセット
              </button>
            </div>
          )}
        </main>

        <footer className="mt-auto border-t border-gray-200 bg-white py-6 text-center">
          <p className="text-[10px] text-gray-300">Powered by 大口神経整体院</p>
        </footer>
      </div>
    )
  }

  // ワークシート記入画面
  if (!activeStep) return null
  const progress = getStepProgress(activeStep)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => setCurrentStep(null)} className="text-gray-400 hover:text-gray-600 transition-colors text-sm">← 一覧</button>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">STEP {activeStep.number}/{steps.length}</span>
              <span className="text-xs font-bold text-slate-600">{progress.filled}/{progress.total}</span>
            </div>
          </div>
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-2">
            <div className="h-full rounded-full bg-slate-700 transition-all duration-500" style={{ width: `${progress.percent}%` }} />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 flex-1 w-full">
        <div className="mb-6">
          <p className="text-xs text-slate-500 font-bold mb-1">STEP {activeStep.number}</p>
          <h1 className="text-xl font-bold text-gray-900">{activeStep.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{activeStep.subtitle}</p>
          <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-4">
            <p className="text-xs text-slate-600 leading-relaxed">{activeStep.description}</p>
          </div>
        </div>

        <div className="space-y-5">
          {activeStep.fields.map(field => (
            <FieldInput key={field.id} field={field} value={answers[field.id] || ''} onChange={(val) => updateAnswer(field.id, val)} />
          ))}
        </div>

        <div className="flex gap-3 mt-8 mb-4">
          {currentStep > 0 && (
            <button onClick={() => { setCurrentStep(currentStep - 1); window.scrollTo({ top: 0 }) }} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
              ← 前のステップ
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button onClick={() => { setCurrentStep(currentStep + 1); window.scrollTo({ top: 0 }) }} className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
              次のステップ →
            </button>
          ) : (
            <button onClick={() => { setCurrentStep(null); window.scrollTo({ top: 0 }) }} className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
              完了して一覧に戻る
            </button>
          )}
        </div>
      </main>

      <footer className="mt-auto border-t border-gray-200 bg-white py-6 text-center">
        <p className="text-[10px] text-gray-300">Powered by 大口神経整体院</p>
      </footer>
    </div>
  )
}

function FieldInput({ field, value, onChange }: { field: Field; value: string; onChange: (val: string) => void }) {
  const isFilled = value.trim().length > 0
  const baseInput = "w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors"

  return (
    <div>
      <div className="flex items-start gap-2 mb-2">
        <div className={`w-4 h-4 rounded border-2 mt-0.5 shrink-0 flex items-center justify-center transition-colors ${isFilled ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
          {isFilled && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <label className="text-sm font-medium text-gray-900">{field.label}</label>
      </div>
      {field.hint && <p className="text-xs text-gray-400 mb-2 ml-6">{field.hint}</p>}
      <div className="ml-6">
        {field.type === 'textarea' ? (
          <textarea value={value} onChange={e => onChange(e.target.value)} className={`${baseInput} ${isFilled ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-white'}`} rows={3} placeholder={field.placeholder} />
        ) : field.type === 'select' ? (
          <select value={value} onChange={e => onChange(e.target.value)} className={`${baseInput} ${isFilled ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-white'}`}>
            <option value="">選択してください</option>
            {field.options?.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
          </select>
        ) : (
          <input type={field.type === 'number' ? 'number' : 'text'} value={value} onChange={e => onChange(e.target.value)} className={`${baseInput} ${isFilled ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-white'}`} placeholder={field.placeholder} />
        )}
      </div>
    </div>
  )
}
