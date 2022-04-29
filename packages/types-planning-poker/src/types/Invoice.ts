export interface Invoice {
    lines: InvoiceLines | null
    total: number
    tax?: any
}

interface InvoiceLines {
    data?: LineItem[]
}

interface LineItem {
    description: string
    amount: number
    period?: TrialPeriod
}

interface TrialPeriod {
    end: number
}