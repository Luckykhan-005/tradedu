# Forex Signal Scanner - Technical Specifications & Component Breakdown

## Project Overview
A comprehensive forex trading signal analysis and automation platform with web-based UI, featuring real-time market scanning, automated trading bot, demo/live account integration, and historical backtesting capabilities.

---

## Technology Stack (Inferred)

### Frontend
- **Framework**: React or Vue.js (component-based architecture implied)
- **Styling**: CSS-in-JS or Tailwind CSS (dark theme consistent styling)
- **State Management**: Redux, Pinia, or Vuex (complex state for multiple accounts/strategies)
- **API Client**: Axios or Fetch API
- **Charting Library**: TradingView Lightweight Charts or Chart.js (for price data)
- **Real-time Updates**: WebSocket for live data

### Backend
- **API Framework**: Node.js/Express, Python/FastAPI, or similar
- **Job Scheduler**: Node-cron or similar (for bot 30-minute intervals)
- **Database**: PostgreSQL, MongoDB (for trade history, configurations)
- **Broker Integration**: OANDA API v20 (for live trading)
- **Hosting**: Vercel (indicated by URL: forex-scanner.vercel.app)

### External APIs
- **OANDA REST API v20**: Account access, order placement, trade management
- **Financial Data API**: Forex pricing data, technical indicators
- **WebSocket Feeds**: Real-time price updates

---

## Core Components Breakdown

### 1. Navigation System
**Component: MainNav / TabNavigation**
```
Props:
  - activeTab: string
  - tabList: array[{name, label, icon}]
  - onTabChange: function
  
Structure:
  - Horizontal tab bar
  - Active indicator (bottom border)
  - Badge system (notification count on OANDA tab)
```

**Tabs Configuration:**
```javascript
[
  { id: 'scanner', name: 'SCANNER', icon: null },
  { id: 'chart', name: 'CHART', icon: null },
  { id: 'demo', name: 'DEMO', icon: null },
  { id: 'oanda', name: 'OANDA', badge: 1 },
  { id: 'bot', name: 'BOT', icon: null },
  { id: 'backtest', name: 'BACKTEST', icon: null },
  { id: 'clock', name: 'CLOCK', icon: null }
]
```

---

### 2. Scanner Tab Components

#### 2.1 Disclaimer Banner
**Component: WarningBanner**
```
Props:
  - type: 'disclaimer'
  - message: string
  - onClose: function
  
Features:
  - Always visible by default
  - Closable with ✕ button
  - Red/orange background (#cc3333 region)
  - Icon + text + close button layout
  - Persistent state (optional localStorage)
```

#### 2.2 Timeframe Selector
**Component: ButtonGroup / SegmentedControl**
```
Props:
  - label: 'TIMEFRAME'
  - options: ['15M', '1H', '4H', '1D']
  - value: '4H' (default)
  - onChange: function
  
Styling:
  - Horizontal button group
  - Green highlight for selected
  - Single selection (radio behavior)
  - Equal width buttons
```

#### 2.3 History Depth Selector
**Component: ButtonGroup**
```
Props:
  - label: 'HISTORY DEPTH'
  - options: [300, 500, 1000, 2000, 5000]
  - value: 500 (default)
  - onChange: function
  
Styling:
  - Gold highlight for selected
  - Single selection
```

#### 2.4 Look-Ahead Selector
**Component: ButtonGroup**
```
Props:
  - label: 'LOOK-AHEAD'
  - options: ['5c', '10c', '20c', '30c']
  - value: '10c' (default)
  - onChange: function
  
Notes:
  - 'c' = candles
  - Cyan highlight for selected
```

#### 2.5 Currency Pairs Selector
**Component: MultiSelect / TagInput**
```
Props:
  - label: 'PAIRS'
  - options: [
      'EUR/USD',
      'GBP/USD',
      'USD/JPY',
      'USD/CHF',
      'AUD/USD',
      'USD/CAD',
      'NZD/USD',
      'EUR/GBP',
      'EUR/JPY',
      'GBP/JPY',
      'XAU/USD'
    ]
  - selectedCount: 3 (displays in label)
  - onChange: function
  - maxSelect: optional limit
  
Features:
  - Multiple selection toggle
  - Dynamic label update
  - Cyan border for selected items
```

#### 2.6 MIN CONFLUENCE Slider
**Component: RangeSlider / Slider**
```
Props:
  - label: 'MIN CONFLUENCE'
  - min: 0
  - max: 20
  - value: 7 (default)
  - step: 1
  - onChange: function
  
Visual:
  - Yellow filled portion (0 to value)
  - Gray remaining portion (value to max)
  - Circle handle
  - Label shows "7/20" format
  - Tooltip on hover (optional)
```

#### 2.7 Signal Weights Configuration
**Component: SignalWeightsPanel**
```
Props:
  - isExpanded: boolean
  - onToggle: function
  - weights: object
  - onWeightChange: function
  - presets: array
  
State:
  - Expanded/collapsed state
  
Sub-components:
  - WeightControl (for each indicator)
  - PresetButton (for each strategy)
  - ResetButton
```

**Weight Control Component:**
```
Props:
  - label: string (e.g., 'Trend Direction')
  - value: number (multiplier)
  - options: [0, 0.5, 1, 1.5, 2]
  - onChange: function
  
Visual:
  - Label on left
  - 5 buttons for each multiplier
  - Gold highlight for selected
```

**Available Indicators:**
```javascript
const indicators = [
  { id: 'trend', label: 'Trend Direction' },
  { id: 'macd', label: 'MACD Cross' },
  { id: 'sma200', label: '200 SMA Position' },
  { id: 'support', label: 'Support / Resistance' },
  { id: 'volume', label: 'Volume Confirmation' },
  { id: 'rsi', label: 'RSI Momentum' },
  { id: 'sma50', label: '50 SMA Position' },
  { id: 'bollinger', label: 'Bollinger Bands' },
  { id: 'candle', label: 'Candlestick Pattern' },
  { id: 'session', label: 'Market Session' }
]
```

**Preset Strategies:**
```javascript
const presets = [
  {
    name: 'Swing Trader',
    desc: 'Balanced — trend, key levels & 200 SMA lead',
    weights: { trend: 1.5, sma200: 1.5, macd: 1, ... }
  },
  {
    name: 'Scalper',
    desc: 'Fast entries — RSI, MACD, session timing & momentum',
    weights: { rsi: 1.5, macd: 1.5, session: 1, ... }
  },
  // ... more presets
]
```

#### 2.8 Auto-Scan Control
**Component: AutoScanToggle**
```
Props:
  - enabled: boolean
  - onToggle: function
  - timezone: string
  - onTimezoneChange: function
  
Features:
  - Play/pause icon toggle
  - Timezone display/selector
  - Runs scans on schedule
```

#### 2.9 Scan Button
**Component: ActionButton / PrimaryButton**
```
Props:
  - label: string (dynamic, e.g., 'SCAN 3 PAIRS')
  - onClick: function
  - isLoading: boolean
  - disabled: boolean
  
Styling:
  - Green border
  - Full width
  - Large size
  - Play icon prefix
```

#### 2.10 Scan Log Display
**Component: ScanLog / Terminal**
```
Props:
  - logs: array[{type, message, timestamp}]
  - isScanning: boolean
  - scrollToBottom: boolean
  
Features:
  - Dark background (darker than page)
  - Monospace font
  - Color-coded messages:
    - Gray: Info
    - Yellow: Progress
    - Red: Errors
  - Auto-scroll when new logs
  - Scrollable container
```

#### 2.11 Signal Results Display
**Component: SignalCardGrid / ResultsPanel**
```
Props:
  - signals: array[SignalObject]
  - onChartClick: function
  - onTradeClick: function
  
Renders:
  - Grid of signal cards when results available
  - Empty state message when no signals
  
Signal Card Content:
  - Currency pair
  - Direction (LONG/SHORT with color)
  - Confluence score
  - Entry price/levels
  - Chart button
  - Trade button
  - Technical indicators triggered
```

---

### 3. Chart Tab Components

#### 3.1 Chart View
**Component: ChartView / PairTimeframeSelector**
```
Props:
  - availablePairs: array
  - selectedPair: string
  - onPairChange: function
  - availableTimeframes: array
  - selectedTimeframe: string
  - onTimeframeChange: function
  - onLoadChart: function
  
Sub-components:
  - ButtonGroup (pairs)
  - ButtonGroup (timeframes)
  - ActionButton (load chart)
  - ChartDisplay (TradingView component)
```

---

### 4. Demo Tab Components

#### 4.1 Account Header
**Component: AccountHeader**
```
Props:
  - accountType: 'DEMO' | 'LIVE'
  - balance: number
  - startBalance: number
  - gainLoss: number
  
Displays:
  - Account type label
  - Balance in large font
  - Starting balance with total gain/loss
```

#### 4.2 Statistics Grid
**Component: StatisticsGrid / StatsCard**
```
Props:
  - stats: object {
      openTrades: number,
      openPnl: number,
      totalTrades: number,
      winRate: number,
      winsLosses: string
    }
  
Layout:
  - 5 columns, responsive
  - Label + value structure
  - Color coding (green/red for P&L)
  
Individual Stat Cards:
  - Label (gray)
  - Value (large, bold)
  - Color based on value
```

#### 4.3 Top Up Button
**Component: Button**
```
Props:
  - icon: '+' | 'add'
  - label: 'TOP UP'
  - onClick: function
  
Styling:
  - Gold/yellow border
  - Top right positioning
```

#### 4.4 Open Trades Section
**Component: OpenTradesPanel**
```
Props:
  - trades: array
  - onCloseClick: function
  
Features:
  - Empty state: "No open trades..."
  - Would display trade cards when active
```

---

### 5. OANDA Tab Components

#### 5.1 Account Header (OANDA variant)
**Component: OandaAccountHeader**
```
Props:
  - balance: number
  - stats: object {
      openTrades: number,
      openPnl: number,
      realizedPnl: number,
      winRate: number,
      winsLosses: string
    }
  - onRefresh: function
  
Features:
  - "↻ REFRESH" button
  - Account type: "OANDA PRACTICE ACCOUNT"
```

#### 5.2 Open Positions Panel
**Component: OpenPositionsPanel**
```
Props:
  - positions: array[PositionObject]
  - onClosePosition: function
  
Position Card Structure:
  - Green left border
  - Currency pair (large)
  - Direction badge (LONG/SHORT)
  - Lot size
  - P&L display (red/green)
  - Pips display
  - Four data rows:
    - Entry price
    - Current price
    - Stop Loss
    - Take Profit
  - Metadata: open time, trade ID
  - "Close Position" action button
```

**Position Object Schema:**
```javascript
{
  id: string,
  pair: string,
  direction: 'LONG' | 'SHORT',
  entryPrice: number,
  currentPrice: number,
  stopLoss: number,
  takeProfit: number,
  pnl: number,
  pips: number,
  lotSize: number,
  openTime: timestamp,
  tradeId: string
}
```

#### 5.3 Closed Trades Panel
**Component: ClosedTradesPanel**
```
Props:
  - trades: array[ClosedTradeObject]
  - hasMore: boolean
  - onToggleVisibility: function
  
Features:
  - Collapsible/expandable with "hide" toggle
  - Table/list of closed trades
  - Sortable columns (optional)
  - Scrollable
  - Color-coded P&L (green/red)
```

**Closed Trade Object Schema:**
```javascript
{
  id: string,
  timestamp: datetime,
  pair: string,
  direction: 'L' | 'S',
  entryPrice: number,
  exitPrice: number,
  pnl: number,
  tradeId: string
}
```

---

### 6. BOT Tab Components

#### 6.1 Information Banner
**Component: InfoBox**
```
Props:
  - content: ReactNode
  - backgroundColor: 'blue'
  
Content:
  - "HOW IT WORKS" header
  - Explanation text
  - Icon indicators
```

#### 6.2 Bot Status Panel
**Component: BotStatusPanel**
```
Props:
  - isActive: boolean
  - strategyCount: number
  - interval: number (minutes)
  - onStopBot: function
  - onRunNow: function
  - onTestScan: function
  - testScanEnabled: boolean
  
Display:
  - Green circle indicator when active
  - Status text
  - Three action buttons
```

#### 6.3 Strategy Card Grid
**Component: StrategyGrid**
```
Props:
  - strategies: array[StrategyObject]
  - onStrategyClick: function
  - onPreview: function
  
Grid Layout:
  - 3 columns, responsive
  - Auto-flow rows
```

**Strategy Card Component:**
```
Props:
  - strategy: StrategyObject
  - onClick: function
  - onPreview: function
  
Content Areas:
  - Strategy name + status badge
  - Description text
  - Balance display
  - P&L (large, color-coded)
  - Win rate percentage
  - Configuration stats (min/max trades, time windows)
```

**Strategy Object Schema:**
```javascript
{
  id: string,
  name: string,
  description: string,
  status: 'ACTIVE' | 'INACTIVE',
  balance: number,
  pnl: number,
  winRate: number,
  trades: {
    total: number,
    wins: number,
    losses: number
  },
  config: {
    minConfluence: string,
    maxTrades: number,
    timeWindow: string // e.g., "08:00-10:00 GMT"
  }
}
```

**Available Strategies:**
```javascript
const strategies = [
  {
    name: 'Turtle Trader',
    description: 'Classic trend-following strategy'
  },
  {
    name: 'London Breakout',
    description: 'Session-based breakout trades'
  },
  {
    name: 'ICT Kill Zone',
    description: 'Order flow-based entries'
  },
  {
    name: 'Wyckoff Reversal',
    description: 'Accumulation/distribution patterns'
  },
  {
    name: 'Smart Money (SMC)',
    description: 'Smart money concepts'
  },
  {
    name: 'Momentum Burst',
    description: 'Momentum-based entries'
  },
  {
    name: 'Statistical Pairs',
    description: 'Correlation-based pairs trading'
  },
  {
    name: 'Asian Breakout',
    description: 'Asian session breakout strategy'
  },
  {
    name: 'Carry Trade',
    description: 'Interest rate differential trading'
  }
]
```

---

### 7. Backtest Tab Components

#### 7.1 Backtest Configuration
**Component: BacktestConfigPanel**
```
Props:
  - config: BacktestConfig
  - onConfigChange: function
  - onRunBacktest: function
  - isLoading: boolean
  
Sub-components:
  - Timeframe selector (ButtonGroup)
  - History depth selector (ButtonGroup)
  - Look-ahead selector (ButtonGroup)
  - Pair selector (ButtonGroup)
  - MIN CONFLUENCE slider
  - Run button (large, green)
```

**BacktestConfig Schema:**
```javascript
{
  timeframe: '15M' | '1H' | '4H' | '1D',
  historyDepth: 300 | 500 | 1000 | 2000 | 5000,
  lookAhead: '5' | '10' | '20' | '30', // in candles
  pair: string,
  minConfluence: number
}
```

#### 7.2 Backtest Results
**Component: BacktestResultsPanel**
```
Props:
  - results: BacktestResults
  - isLoading: boolean
  
Features:
  - Performance chart
  - Statistics summary
  - Trade list
  - Downloadable report (optional)
```

---

### 8. Clock Tab Components

#### 8.1 Time Display
**Component: UtcTimeClock**
```
Props:
  - timezone: string
  - onTimezoneChange: function
  
Display:
  - Large monospace time (HH:MM:SS)
  - Date below
  - Active market session indicator
  - Updates in real-time
```

#### 8.2 Session Timeline
**Component: SessionTimeline**
```
Props:
  - sessions: array[SessionObject]
  - currentTime: datetime
  
Features:
  - Horizontal bar chart
  - Color-coded sessions
  - Current time indicator line
  - Time axis (00-24 hours)
  - Session overlap indicators
```

**Session Object:**
```javascript
{
  name: 'London' | 'New York' | 'Tokyo' | 'Sydney',
  color: string,
  startHour: number,
  endHour: number,
  pairs: string[]
}
```

#### 8.3 Market Sessions Info Grid
**Component: SessionInfoGrid**
```
Props:
  - sessions: array
  - currentTime: datetime
  
Grid Layout:
  - 2 columns, responsive
  - 4 session cards
  
Session Info Card:
  - Session name
  - Status badge (OPEN/CLOSED)
  - Time range (UTC)
  - Time until open/close
  - Major pairs (comma-separated)
```

---

## State Management Structure

### Redux Store (Example)

```javascript
{
  scanner: {
    config: {
      timeframe: '4H',
      historyDepth: 500,
      lookAhead: '10c',
      selectedPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
      minConfluence: 7,
      weights: { /* 10 indicator weights */ }
    },
    results: {
      signals: [],
      isScanning: false,
      logs: []
    },
    autoScan: {
      enabled: false,
      timezone: 'London',
      interval: 30000 // ms
    }
  },
  
  chart: {
    selectedPair: 'EUR/USD',
    selectedTimeframe: '4H',
    candleData: [],
    isLoading: false
  },
  
  accounts: {
    demo: {
      balance: 10000,
      positions: [],
      tradeHistory: [],
      stats: { /* account stats */ }
    },
    oanda: {
      connected: true,
      balance: 99967.365,
      positions: [ /* open positions */ ],
      tradeHistory: [ /* closed trades */ ],
      stats: { /* account stats */ }
    }
  },
  
  bot: {
    strategies: [ /* strategy objects */ ],
    isRunning: true,
    lastRun: timestamp,
    nextRun: timestamp,
    settings: { /* bot settings */ }
  },
  
  backtest: {
    config: { /* backtest config */ },
    results: null,
    isRunning: false
  },
  
  ui: {
    activeTab: 'scanner',
    isDarkMode: true,
    toasts: []
  }
}
```

---

## API Endpoints (Expected)

### Scanner Endpoints
- `POST /api/scanner/scan` - Execute scan
- `GET /api/scanner/results/{scanId}` - Get scan results
- `POST /api/scanner/signals` - Create trade from signal
- `GET /api/scanner/logs` - Get scan logs

### Chart Endpoints
- `GET /api/chart/candles/{pair}/{timeframe}` - Get candle data
- `GET /api/chart/indicators/{pair}/{timeframe}` - Get indicator data

### Account Endpoints
- `GET /api/account/demo/balance` - Demo account balance
- `GET /api/account/demo/positions` - Demo positions
- `GET /api/account/oanda/balance` - OANDA balance
- `GET /api/account/oanda/positions` - OANDA positions
- `POST /api/account/oanda/close-position/{positionId}` - Close position
- `GET /api/account/oanda/history` - Trade history

### Bot Endpoints
- `POST /api/bot/start` - Start bot
- `POST /api/bot/stop` - Stop bot
- `POST /api/bot/run-now` - Execute immediate run
- `POST /api/bot/test-scan` - Preview strategy
- `GET /api/bot/strategies` - Get all strategies
- `GET /api/bot/strategies/{strategyId}/stats` - Strategy performance

### Backtest Endpoints
- `POST /api/backtest/run` - Execute backtest
- `GET /api/backtest/results/{backtestId}` - Get results
- `GET /api/backtest/status/{backtestId}` - Poll status

### Market Data Endpoints
- `GET /api/market/sessions` - Get session info
- `GET /api/market/time` - Get current UTC time

---

## Styling System

### CSS Variables / Theme

```css
:root {
  /* Colors */
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --bg-tertiary: #0f3460;
  
  --text-primary: #e0e0e0;
  --text-secondary: #9a9a9a;
  
  --accent-green: #00ff88;
  --accent-cyan: #00d4ff;
  --accent-gold: #ffd700;
  --accent-red: #ff3333;
  
  --positive: #00ff00;
  --negative: #ff3333;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Typography */
  --font-mono: 'Courier New', monospace;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.4);
}
```

### Button Styles

```css
.btn {
  border-radius: 4px;
  padding: var(--spacing-md) var(--spacing-lg);
  font-family: var(--font-mono);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  border-color: var(--accent-green);
  color: var(--accent-green);
  background: transparent;
}

.btn-primary:hover {
  background: rgba(0, 255, 136, 0.1);
}

.btn-gold {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

.btn-red {
  border-color: var(--accent-red);
  color: var(--accent-red);
}

.btn-selected {
  background: rgba(0, 255, 136, 0.2);
}
```

---

## Performance Considerations

1. **Real-time Updates**: Use WebSocket for market data
2. **Lazy Loading**: Load chart data on demand
3. **Virtualization**: Virtual scrolling for long trade lists
4. **Debouncing**: Debounce slider changes and configuration updates
5. **Memoization**: Memoize expensive components (charts, grids)
6. **Code Splitting**: Lazy load bot/backtest sections
7. **Image Optimization**: Optimize candlestick chart rendering
8. **Caching**: Cache market session data, configuration presets

---

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Accessibility Features

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators
- Color contrast ratios WCAG AA compliant
- Alt text for indicators/badges

---

## Security Considerations

1. **API Key Management**: Store OANDA API key securely (environment variables)
2. **Session Management**: Implement token-based auth
3. **Input Validation**: Validate all form inputs
4. **HTTPS Only**: Enforce HTTPS for API calls
5. **CORS**: Configure appropriate CORS policies
6. **Rate Limiting**: Implement rate limiting on API endpoints
7. **Error Handling**: Don't expose sensitive info in error messages

---

## Testing Requirements

### Unit Tests
- Component rendering
- State management
- Utility functions
- API response handling

### Integration Tests
- Scanner workflow
- Account integration
- Bot automation
- Backtest execution

### E2E Tests
- Full user workflows
- Tab navigation
- Form submission
- Error scenarios

### Performance Tests
- Load testing on WebSocket connections
- Large dataset rendering (1000+ signals)
- Memory leak detection
- CPU usage monitoring

---

## Deployment

- **Hosting**: Vercel (indicated by domain)
- **Build Command**: Next.js/React build process
- **Environment Variables**: OANDA_API_KEY, API_URL, WS_URL
- **Database**: Cloud database (PostgreSQL/MongoDB)
- **Cron Jobs**: Server-side scheduled tasks for bot

---

## Future Enhancement Opportunities

1. Mobile app version (React Native)
2. Advanced charting features (TradingView embedded)
3. Notification system (email, SMS alerts)
4. Custom strategy builder UI
5. ML-based signal prediction
6. Multi-account dashboard
7. Performance analytics dashboard
8. Video tutorials
9. Community strategy sharing
10. Signal webhooks for external integrations

