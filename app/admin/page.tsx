'use client'

import { useEffect, useState } from 'react'
import { supabase, type DbStep, type DbField } from '../lib/supabase'
import Link from 'next/link'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [checkingAuth, setCheckingAuth] = useState(true)

  const [steps, setSteps] = useState<DbStep[]>([])
  const [fields, setFields] = useState<DbField[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStep, setSelectedStep] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [error, setError] = useState('')

  // 編集モーダル
  const [editingField, setEditingField] = useState<DbField | null>(null)
  const [editingStep, setEditingStep] = useState<DbStep | null>(null)
  const [saving, setSaving] = useState(false)

  // 新規フィールド追加
  const [addingField, setAddingField] = useState(false)
  const [newField, setNewField] = useState({ field_key: '', label: '', hint: '', field_type: 'text', placeholder: '', options: '' })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) { setAuthed(true); fetchData() }
    setCheckingAuth(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setLoginError('メールアドレスまたはパスワードが正しくありません'); return }
    setAuthed(true)
    fetchData()
  }

  const fetchData = async () => {
    setLoading(true)
    const [{ data: s }, { data: f }] = await Promise.all([
      supabase.from('ws_steps').select('*').order('number'),
      supabase.from('ws_fields').select('*').order('sort_order'),
    ])
    setSteps(s || [])
    setFields(f || [])
    setLoading(false)
  }

  // ステップ編集
  const handleSaveStep = async () => {
    if (!editingStep) return
    setSaving(true)
    const { error } = await supabase.from('ws_steps').update({
      title: editingStep.title,
      subtitle: editingStep.subtitle,
      description: editingStep.description,
    }).eq('id', editingStep.id)
    if (error) { setError('更新に失敗しました'); setSaving(false); return }
    setSuccessMsg('ステップを更新しました')
    setEditingStep(null)
    setSaving(false)
    fetchData()
  }

  // フィールド編集
  const handleSaveField = async () => {
    if (!editingField) return
    setSaving(true)
    const { error } = await supabase.from('ws_fields').update({
      label: editingField.label,
      hint: editingField.hint,
      field_type: editingField.field_type,
      placeholder: editingField.placeholder,
      options: editingField.options,
      sort_order: editingField.sort_order,
    }).eq('id', editingField.id)
    if (error) { setError('更新に失敗しました'); setSaving(false); return }
    setSuccessMsg('質問を更新しました')
    setEditingField(null)
    setSaving(false)
    fetchData()
  }

  // フィールド追加
  const handleAddField = async () => {
    if (!selectedStep || !newField.label.trim() || !newField.field_key.trim()) {
      setError('キーとラベルは必須です')
      return
    }
    setSaving(true)
    const stepFields = fields.filter(f => f.step_id === selectedStep)
    const maxSort = stepFields.length > 0 ? Math.max(...stepFields.map(f => f.sort_order)) : 0
    const opts = newField.options.trim() ? newField.options.split('\n').filter(o => o.trim()) : null

    const { error } = await supabase.from('ws_fields').insert({
      step_id: selectedStep,
      field_key: newField.field_key,
      label: newField.label,
      hint: newField.hint,
      field_type: newField.field_type,
      placeholder: newField.placeholder,
      options: opts,
      sort_order: maxSort + 1,
    })
    if (error) { setError('追加に失敗しました'); setSaving(false); return }
    setSuccessMsg('質問を追加しました')
    setAddingField(false)
    setNewField({ field_key: '', label: '', hint: '', field_type: 'text', placeholder: '', options: '' })
    setSaving(false)
    fetchData()
  }

  // フィールド削除
  const handleDeleteField = async (id: string, label: string) => {
    if (!confirm(`「${label}」を削除しますか？`)) return
    await supabase.from('ws_fields').delete().eq('id', id)
    setSuccessMsg('質問を削除しました')
    fetchData()
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-gray-900 rounded-full"></div>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-white">管理画面</h1>
            <p className="text-slate-400 text-xs mt-1">商品コンセプト設計ワークシート</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
            {loginError && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{loginError}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" required />
            </div>
            <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">ログイン</button>
            <div className="text-center">
              <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">← ワークシートへ戻る</Link>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const stepFields = selectedStep ? fields.filter(f => f.step_id === selectedStep) : []
  const selectedStepData = steps.find(s => s.id === selectedStep)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">← ワークシート</Link>
            <div className="w-px h-4 bg-gray-200"></div>
            <h1 className="font-bold text-gray-900 text-sm">ワークシート管理</h1>
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => setAuthed(false))} className="px-3 py-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">ログアウト</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-xl mb-4 flex items-center justify-between">
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg('')} className="text-green-400 hover:text-green-600 text-lg">&times;</button>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-4 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 text-lg">&times;</button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-10"><div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-gray-900 rounded-full mx-auto"></div></div>
        ) : (
          <div className="lg:flex lg:gap-6">
            {/* ステップ一覧（左） */}
            <div className="lg:w-64 shrink-0 mb-6 lg:mb-0">
              <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase">ステップ一覧</h2>
              <div className="space-y-2">
                {steps.map(step => (
                  <button
                    key={step.id}
                    onClick={() => { setSelectedStep(step.id); setAddingField(false) }}
                    className={`w-full text-left p-3 rounded-xl text-sm transition-colors ${
                      selectedStep === step.id ? 'bg-slate-900 text-white' : 'bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-bold">Step {step.number}</span>
                    <p className={`text-xs mt-0.5 ${selectedStep === step.id ? 'text-slate-300' : 'text-gray-400'}`}>{step.title}</p>
                    <p className={`text-[10px] mt-0.5 ${selectedStep === step.id ? 'text-slate-400' : 'text-gray-300'}`}>
                      {fields.filter(f => f.step_id === step.id).length}問
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* フィールド編集（右） */}
            <div className="flex-1">
              {!selectedStep ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                  <p className="text-gray-400 text-sm">左のステップを選んでください</p>
                </div>
              ) : (
                <>
                  {/* ステップ情報の編集 */}
                  {selectedStepData && (
                    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="font-bold text-sm">Step {selectedStepData.number}: {selectedStepData.title}</h2>
                        <button
                          onClick={() => setEditingStep({ ...selectedStepData })}
                          className="px-3 py-1 bg-slate-50 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-100"
                        >
                          ステップ情報を編集
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">{selectedStepData.subtitle}</p>
                    </div>
                  )}

                  {/* 質問一覧 */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-gray-500">{stepFields.length}問の質問</h3>
                    <button
                      onClick={() => setAddingField(true)}
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800"
                    >
                      + 質問を追加
                    </button>
                  </div>

                  {/* 新規追加フォーム */}
                  {addingField && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                      <h4 className="font-bold text-sm mb-3">新しい質問を追加</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-gray-700">キー（英数字）</label>
                          <input type="text" value={newField.field_key} onChange={e => setNewField({ ...newField, field_key: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="例: new_question" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700">質問ラベル</label>
                          <input type="text" value={newField.label} onChange={e => setNewField({ ...newField, label: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="例: あなたの強みは何ですか？" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700">ヒント</label>
                          <input type="text" value={newField.hint} onChange={e => setNewField({ ...newField, hint: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-gray-700">タイプ</label>
                            <select value={newField.field_type} onChange={e => setNewField({ ...newField, field_type: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                              <option value="text">テキスト（1行）</option>
                              <option value="textarea">テキスト（複数行）</option>
                              <option value="select">選択肢</option>
                              <option value="number">数値</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700">プレースホルダー</label>
                            <input type="text" value={newField.placeholder} onChange={e => setNewField({ ...newField, placeholder: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                          </div>
                        </div>
                        {newField.field_type === 'select' && (
                          <div>
                            <label className="text-xs font-medium text-gray-700">選択肢（1行に1つ）</label>
                            <textarea value={newField.options} onChange={e => setNewField({ ...newField, options: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={3} placeholder="選択肢1\n選択肢2\n選択肢3" />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button onClick={handleAddField} disabled={saving} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium disabled:opacity-50">追加する</button>
                          <button onClick={() => setAddingField(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">やめる</button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {stepFields.map((field, idx) => (
                      <div key={field.id} className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] text-gray-300">#{idx + 1}</span>
                              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded">{field.field_type}</span>
                              <span className="text-[10px] text-gray-300">{field.field_key}</span>
                            </div>
                            <p className="font-medium text-sm text-gray-900">{field.label}</p>
                            {field.hint && <p className="text-xs text-gray-400 mt-0.5">{field.hint}</p>}
                            {field.placeholder && <p className="text-[10px] text-gray-300 mt-1">{field.placeholder}</p>}
                          </div>
                          <div className="flex gap-1 shrink-0 ml-3">
                            <button onClick={() => setEditingField({ ...field })} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-medium hover:bg-blue-100">編集</button>
                            <button onClick={() => handleDeleteField(field.id, field.label)} className="px-2 py-1 text-red-400 hover:bg-red-50 rounded text-[10px]">削除</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ステップ編集モーダル */}
        {editingStep && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h3 className="font-bold text-lg mb-4">Step {editingStep.number} を編集</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700">タイトル</label>
                  <input type="text" value={editingStep.title} onChange={e => setEditingStep({ ...editingStep, title: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">サブタイトル</label>
                  <input type="text" value={editingStep.subtitle || ''} onChange={e => setEditingStep({ ...editingStep, subtitle: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">説明</label>
                  <textarea value={editingStep.description || ''} onChange={e => setEditingStep({ ...editingStep, description: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={3} />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={handleSaveStep} disabled={saving} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium disabled:opacity-50">更新する</button>
                  <button onClick={() => setEditingStep(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">やめる</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* フィールド編集モーダル */}
        {editingField && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h3 className="font-bold text-lg mb-4">質問を編集</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700">質問ラベル</label>
                  <input type="text" value={editingField.label} onChange={e => setEditingField({ ...editingField, label: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">ヒント</label>
                  <input type="text" value={editingField.hint || ''} onChange={e => setEditingField({ ...editingField, hint: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700">タイプ</label>
                    <select value={editingField.field_type} onChange={e => setEditingField({ ...editingField, field_type: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="text">テキスト（1行）</option>
                      <option value="textarea">テキスト（複数行）</option>
                      <option value="select">選択肢</option>
                      <option value="number">数値</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">表示順</label>
                    <input type="number" value={editingField.sort_order} onChange={e => setEditingField({ ...editingField, sort_order: parseInt(e.target.value) || 0 })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">プレースホルダー</label>
                  <textarea value={editingField.placeholder || ''} onChange={e => setEditingField({ ...editingField, placeholder: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={2} />
                </div>
                {editingField.field_type === 'select' && (
                  <div>
                    <label className="text-xs font-medium text-gray-700">選択肢（1行に1つ）</label>
                    <textarea
                      value={(editingField.options || []).join('\n')}
                      onChange={e => setEditingField({ ...editingField, options: e.target.value.split('\n').filter(o => o.trim()) })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={4}
                    />
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <button onClick={handleSaveField} disabled={saving} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium disabled:opacity-50">更新する</button>
                  <button onClick={() => setEditingField(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">やめる</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
