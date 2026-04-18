type User = {
  id: number | string
  name: string
  xp: number
}

type Props = {
  users: User[]
}

export default function LeaderboardTable({ users }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b border-slate-200">
          <tr className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            <th className="px-4 py-3 text-left">Rank</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-right">XP</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {users.map((user, index) => (
            <tr key={user.id} className="text-sm text-slate-700 hover:bg-slate-50">
              <td className="px-4 py-4 font-semibold text-slate-900">#{index + 1}</td>
              <td className="px-4 py-4">{user.name}</td>
              <td className="px-4 py-4 text-right font-semibold text-amber-600">{user.xp.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
