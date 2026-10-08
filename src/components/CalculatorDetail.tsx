import type { ComponentType } from 'react'
import { ArrowLeft } from 'lucide-react'
import { getCalculator } from '@/data/calculators'
import { RiskCalculator } from '@/components/RiskCalculator'
import { NotFound } from '@/components/NotFound'
import type { Page } from '@/components/Navigation'
import { CalcEducation } from './calculators/CalcEducation'
import { PositionSizeTool } from './calculators/PositionSizeTool'
import { RiskRewardTool } from './calculators/RiskRewardTool'
import { LeverageTool } from './calculators/LeverageTool'
import { ProfitLossTool } from './calculators/ProfitLossTool'
import { FuturesPnlTool } from './calculators/FuturesPnlTool'
import { CompoundingTool } from './calculators/CompoundingTool'

const tools: Record<string, ComponentType> = {
  futures: RiskCalculator,
  'position-size': PositionSizeTool,
  'risk-reward': RiskRewardTool,
  leverage: LeverageTool,
  'profit-loss': ProfitLossTool,
  'futures-pnl': FuturesPnlTool,
  compounding: CompoundingTool,
}

interface CalculatorDetailProps {
  slug: string
  onBack: () => void
  onOpen: (slug: string) => void
  onNavigate: (page: Page) => void
}

export function CalculatorDetail({ slug, onBack, onOpen, onNavigate }: CalculatorDetailProps) {
  const def = getCalculator(slug)
  const Tool = tools[slug]

  if (!def || !Tool) {
    return <NotFound onNavigate={() => onBack()} />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Saare Calculators
        </button>
        <div className="mb-6 mt-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <def.icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{def.title}</h1>
            <p className="text-muted-foreground">{def.shortDesc}</p>
          </div>
        </div>
      </div>

      <Tool />

      <CalcEducation def={def} onBack={onBack} onOpen={onOpen} onNavigate={onNavigate} />
    </div>
  )
}
