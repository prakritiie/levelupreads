'use client'

type Challenge = {
  id: number
  title: string
  description: string
  xpReward: number
  deadline: string
}

type Props = {
  challenge: Challenge
  onJoin?: () => void
  joined?: boolean
  actionLabel?: string
}

export default function ChallengeCard({ challenge, onJoin, joined, actionLabel }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{challenge.title}</h3>
          <p className="mt-2 text-sm leading-5 text-slate-600">{challenge.description}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-600">
          <span className="whitespace-nowrap">Deadline: {challenge.deadline}</span>
          <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-900">+{challenge.xpReward} XP</span>
        </div>
        {onJoin ? (
          <button
            type="button"
            onClick={onJoin}
            disabled={joined}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300 whitespace-nowrap"
          >
            {joined ? 'Joined' : actionLabel || 'Join challenge'}
          </button>
        ) : null}
      </div>
    </div>
  )
}
