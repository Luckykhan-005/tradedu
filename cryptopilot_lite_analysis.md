# CryptoPilot Lite - Complete Page Analysis

## Overview
**Application Name:** CryptoPilot Lite AI  
**URL:** https://crypto-pilot-lite.vercel.app/  
**Current Title:** Shogo App  
**Theme:** Dark mode with cyan/teal accent colors

---

## Header & Navigation

### Top Banner
- **Logo/Title:** "CRYPTOPILOT LITE AI" (large cyan text)
- **Status Indicators:**
  - Scanning progress: "Scanning X/245" (shows real-time scan count)
  - Exchange/Market: Shows current active market (e.g., "OKX Perpetual", "US Stocks", "Commodities", "Forex", "Indices")
  - Scan timestamp: "Last: 2:09:34 AM"
  - Signal summary: "0 high / X total" (shows high confidence vs total signals found)

### Control Buttons & Settings
- **Diag Button:** Opens "Pipeline Diagnostics" panel showing detailed scanning metrics
- **Auto Checkbox:** Toggle switch for automatic scanning mode (checked by default)
- **Scan Now Button:** Manual button to trigger immediate scan
- **LIVE Indicator:** Green status badge showing system is live/active

---

## Asset Class Navigation Tabs

The application supports multiple asset classes with dedicated tabs:

1. **Crypto Futures** (Default/Primary)
   - Exchange: OKX Perpetual
   - Scans perpetual futures contracts
   - Shows ticker cards with real-time pricing

2. **Stocks**
   - Shows US Stocks
   - Analyzes stock ticker opportunities

3. **Commodities**
   - Scans commodity futures (GC=F, ZC=F, ZS=F, ZW=F, PL=F, etc.)
   - Commodity ticker cards display prices with percentage changes

4. **Forex**
   - Foreign exchange pairs
   - Major currency pairs analysis

5. **Indices**
   - Market indices scanning
   - Index-based trading opportunities

---

## Pipeline Diagnostics Panel

When opened, the Diag button reveals detailed scanning pipeline statistics:

### Metrics Displayed:
- **Tickers Fetched:** Total symbols fetched from the exchange/data source
- **Candidates Scanned:** Number of symbols passing initial screening
- **Klines OK:** Successfully fetched candle data (shown in green when successful)
- **Klines Failed:** Failed data fetches
- **Fully Analyzed:** Symbols with complete technical analysis

### Signal Filtering:
- **Rejected: No Direction:** Signals with no clear buy/sell signal
- **Rejected: No Score:** Signals failing confidence scoring
- **Passed (< 80%):** Lower confidence signals (70-79%)
- **Passed (≥ 80%):** High confidence signals (80%+)
- **Final Signals:** Total tradeable signals generated (shown in green)

Example (Commodities scan):
- 245 tickers fetched → 30 candidates → 30 fully analyzed
- Result: 14 final signals (with 0 ≥80% confidence)

---

## Trade Opportunity Display

### Trade Cards (3-Card Row)
Display the top 3 opportunities with:
- **Symbol:** Trading symbol (e.g., DOS, XAG, O, SB=F, ZS=F)
- **Timeframe:** Trading timeframe (e.g., "15m-1H" for 15-minute to 1-hour)
- **Confidence Percentile:** Color-coded badge (yellow/gold background)
  - Example: 79%, 77%, 76%, 74%, 69%
- **Direction:** LONG (green check) or SHORT (red X)
- **Risk-to-Reward Ratio:** Format "R:R 1.2.5"
- **Threshold Indicator:** "BELOW 80%" badge (yellow) indicating signal is below 80% confidence threshold
- **Technical Summary:** Brief text describing EMA alignment and market conditions

### Trade Signal Table
Detailed list view with columns:

| Column | Description | Example |
|--------|-------------|---------|
| SYMBOL | Trading symbol | DOS, XAG, O, GIGGLE, WLD, PEPE, SB=F, ZS=F, CT=F, KC=F, PL=F, SI=F |
| DIRECTION | Trade direction (LONG/SHORT) with icon and confidence label | LONG (green check), SHORT (red X), "BELOW" badge |
| CONF. | Confidence percentage in bold | 79%, 77%, 76%, 74%, 68%, 66%, 64% |
| ENTRY | Entry price for the trade | $0.2921, $66.68, $0.5304, $42.35, $1,288.00, $91.54 |
| SL | Stop Loss price (in red text) | $0.2714, $66.82, $0.4911, $39.23, $1,253.36, $88.79 |
| TP2 | Take Profit 2 price (in cyan text) | $0.3438, $66.34, $0.6286, $50.16, $1,374.61, $98.41 |
| R:R | Risk-to-Reward ratio | 1:2.5 |
| TIME | Timeframe | 15m-1H |
| REASON | Technical indicator analysis | "EMA bullish alignment: 9 > 21 > 50. Above EMA200 — macro uptrend. RSI 51.1 — bullish momentum, not overbought. MACD bullish crossover, ADX..." |

### Filtering Options
- **Search Box:** "Search symbol or direction..."
- **Filter Buttons:**
  - All (shows all signals)
  - LONG (shows only long signals)
  - SHORT (shows only short signals)
- **Signal Counter:** "X signals" displayed (e.g., "30 signals")

---

## Price Ticker Cards

Persistent row of cryptocurrency/commodity price cards displayed at bottom of main area:

### Card Format:
- **Symbol:** Ticker symbol (BTC, ETH, TRUMP, SOL, ZEC, GC=F, ZC=F, ZS=F, ZW=F, PL=F)
- **Price:** Current market price
- **24h Change:** Percentage with color coding:
  - Green text: Positive change (e.g., "+0.28%", "+5.61%", "+0.56%")
  - Red text: Negative change (e.g., "-2.14%", "-2.88%")
- **Volume Info:** Trading volume (e.g., "Vol $1.1M", "Vol $207.0M")

Example Commodities Prices:
- GC=F: -2.88%, $4,529.90
- ZC=F: +0.56%, $536.50
- ZS=F: +1.58%, $1,288.00
- ZW=F: +3.06%, $784.00
- PL=F: +0.03%, $1,854.30

---

## Color Scheme & Design

### Primary Colors:
- **Background:** Very dark blue/black (#001a2e or similar)
- **Accent Color:** Cyan/Teal (#00d9ff or similar)
  - Used for: headers, selected tabs, positive indicators, price gains
- **Secondary Accent:** Gold/Yellow (#FFB800 or similar)
  - Used for: confidence badges, "BELOW 80%" indicators
- **Status Colors:**
  - Green (#00FF88): Bullish signals, LONG trades, successful metrics
  - Red (#FF3333): Bearish signals, SHORT trades, losses
  - Cyan (#00FFFF): Stop Loss and Take Profit prices in tables
  - White/Gray: Text and neutral elements

### Layout:
- **Fixed Header:** Sticky banner at top with logo, stats, controls
- **Tab Navigation:** Below header with 5 asset class options
- **Main Content Area:** Split with:
  - Top: Data visualization (scatter plot chart with colored dots)
  - Middle: Trade opportunity cards (3-column grid)
  - Lower: Filtering controls and trade signal table
  - Bottom: Price ticker cards

---

## Key Features & Functionality

### Real-Time Scanning
- Continuously scans 245 symbols across multiple asset classes
- Shows live progress: "Scanning X/245"
- Can be manually triggered with "Scan Now" button
- Auto mode checkbox enables continuous background scanning

### AI Signal Generation
- Analyzes technical indicators (EMA, RSI, MACD, ADX)
- Generates confidence scores for each signal
- Filters signals: <80% confidence vs ≥80% confidence
- Produces "Top 3 Opportunities" ranking

### Multi-Asset Support
- Crypto Futures (perpetual contracts from OKX)
- Stocks (US market)
- Commodities (futures contracts)
- Forex (currency pairs)
- Indices (market indices)

### Advanced Analytics
- Risk-to-Reward ratio calculation (typically 1:2.5)
- Entry/Exit points with Stop Loss and Take Profit levels
- Technical analysis: EMA alignment, RSI, MACD, ADX indicators
- Timeframe analysis: 15-minute to 1-hour swings

### Warning/Info Messages
- "No High Confidence setups available. Showing the strongest current opportunities."
- "No signals match your filters" - when filter is too restrictive
- "Scanner is running. No validated opportunities found yet." - during initial scan
- "Analyzing X/245 perpetual futures..." - progress indicator

---

## Technical Indicators & Analysis

The application uses the following technical analysis tools:

1. **EMA (Exponential Moving Average)**
   - EMA 9, 21, 50, 200 used
   - Bullish alignment: 9 > 21 > 50 (all above EMA200)
   - Bearish alignment: 9 < 21 < 50 (all below EMA200)

2. **RSI (Relative Strength Index)**
   - Values 0-100
   - <30: Oversold (potential buy)
   - 30-70: Neutral
   - >70: Overbought (potential sell)
   - "Bullish momentum, not overbought"

3. **MACD (Moving Average Convergence Divergence)**
   - Bullish crossover: Price increase signal
   - Bearish crossover: Price decrease signal
   - Used with histogram and signal line

4. **ADX (Average Directional Index)**
   - Indicates trend strength
   - "Strong trend" or "moderate trend"

5. **Macro Context**
   - "Macro uptrend" / "Macro downtrend"
   - Looks at larger timeframe context

---

## Example Trade Opportunities Found

### Commodities Scan Results (14 signals):

**LONG & SHORT Signals:**
1. DOS: 79% confidence, LONG, Entry: $0.2921, SL: $0.2714, TP2: $0.3438
2. XAG: 77% confidence, SHORT, Entry: $66.68, SL: $66.82, TP2: $66.34
3. O: 76% confidence, LONG, Entry: $0.5304, SL: $0.4911, TP2: $0.6286
4. GIGGLE: 74% confidence, LONG, Entry: $42.35, SL: $39.23, TP2: $50.16
5. WLD: 68% confidence, SHORT, Entry: $0.3744, SL: $0.3824, TP2: $0.3545
6. PEPE: 66% confidence, SHORT, Entry: $0.000004, SL: $0.000004, TP2: $0.000003
7. SB=F: 74% confidence, LONG, Entry: $17.56, SL: $16.38, TP2: $20.51
8. ZS=F: 69% confidence, LONG, Entry: $1,288.00, SL: $1,253.36, TP2: $1,374.61
9. CT=F: 69% confidence, LONG, Entry: $91.54, SL: $88.79, TP2: $98.41
10. KC=F: 68% confidence, LONG, Entry: $312.60, SL: $284.81, TP2: $382.08
11. PL=F: 64% confidence, LONG, Entry: $1,854.30, SL: $1,798.36, TP2: $1,994.16
12. SI=F: 64% confidence, LONG, Entry: $67.79, SL: $64.59, TP2: $75.78

---

## User Interface Interactions

### Available Actions:
1. **Tab Navigation:** Click asset class tabs to switch markets
2. **Search:** Use search box to filter by symbol or direction
3. **Direction Filter:** Click All/LONG/SHORT buttons to filter signals
4. **Scan Control:** Click "Scan Now" to manually trigger scan
5. **Settings:** Toggle "Auto" for continuous scanning
6. **Diagnostics:** Click "Diag" to show/hide pipeline diagnostics

### Page States:
- **Scanning:** Shows progress spinner and "Re-scanning" message
- **Loaded:** Displays all signals and trade opportunities
- **Filtered:** Shows message if filters eliminate all results
- **No Results:** Shows when market has no signals

---

## Accessibility & Scanning Parameters

### Scanning Scope:
- Total symbols monitored: 245 (as shown in header)
- Timeframe analyzed: 15-minute to 1-hour candles
- Exchange: OKX (for crypto futures)
- Data source: Real-time market data

### Confidence Thresholds:
- High Confidence: ≥ 80%
- Standard: 70-79%
- All confidence levels shown in interface

### Risk Management:
- Every signal includes Stop Loss and Take Profit levels
- Risk-to-Reward ratios pre-calculated (typically 1:2.5)
- Entry points defined with precision
- Macro context considered in analysis

---

## Summary

CryptoPilot Lite is a sophisticated multi-asset trading signal generator that:

1. **Scans multiple markets:** Crypto, Stocks, Commodities, Forex, Indices
2. **Analyzes in real-time:** Shows live progress and continuously updates
3. **Uses advanced TA:** EMA, RSI, MACD, ADX indicators
4. **Calculates risk/reward:** Pre-defined entry, stop loss, take profit levels
5. **Ranks signals:** Top 3 opportunities highlighted, confidence scores displayed
6. **Provides transparency:** Diagnostic tools show how signals are generated
7. **Offers filtering:** Search and direction filtering for signal discovery
8. **Supports automation:** Auto-scan mode with manual trigger capability

The interface is clean, dark-themed, and designed for quick decision-making with all critical information visible at a glance.
