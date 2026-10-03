-- TradeEd: Advanced Crypto Trading Course (Urdu) — 13 lessons (25-37)
-- Supabase SQL Editor mein paste kar ke Run karein.

WITH course AS (
  INSERT INTO courses (id, title, description, level, thumbnail, price, is_published, duration, rating, student_count, created_at, updated_at)
  VALUES (gen_random_uuid(), 'Crypto Trading Course — Advanced (Urdu)', 'Yeh course Crypto Trading series ka Advanced level hai — Psychology, Futures, DeFi, Trading Bots, Risk Management aur Professional Strategy par mukammal tafseel. Intermediate course complete karne ke baad yeh shuru karein.

IS COURSE ME:
- Trading psychology — 90% traders kyun fail hote hain
- Perpetual contracts, funding rate aur futures trading secrets
- Margin vs leverage, short selling aur arbitrage strategies
- Coin value, market cap aur DeFi ecosystem
- Trading bots aur backtesting — strategy test kaise karein
- Risk management ke 12 zaroori rules
- Successful traders ki habits aur complete trading framework

Har lesson mein Urdu mein video aur asaan notes shamil hain.', 'advanced', NULL, 0, true, '1:32 Hours', 0, 0, now(), now())
  RETURNING id
), m1 AS (
  INSERT INTO modules (id, course_id, title, "order", created_at)
  SELECT gen_random_uuid(), id, 'Advanced Concepts — Psychology, Futures & Market Mechanics', 0, now() FROM course
  RETURNING id
), m2 AS (
  INSERT INTO modules (id, course_id, title, "order", created_at)
  SELECT gen_random_uuid(), id, 'Professional Trading — DeFi, Bots, Risk & Strategy', 1, now() FROM course
  RETURNING id
)
INSERT INTO lessons (id, module_id, title, type, duration, video_url, content, "order", created_at)
SELECT gen_random_uuid(),
       CASE WHEN v.ord < 7 THEN (SELECT id FROM m1) ELSE (SELECT id FROM m2) END,
       v.title, v.type, v.duration, v.video_url, v.content, v.ord, now()
FROM (
  VALUES
  -- Module 1: lessons 25-31
  ('Why 90% of Traders Fail? — 7 Reasons Most Traders Lose Money', 'video', '6.63', 'https://youtu.be/r-bzueI36nY', 'Why do so many traders fail in Forex and Crypto trading? 📉
Is it a bad strategy, poor risk management, trading psychology, or simply lack of discipline?

In this TradeEd video, we break down the 7 major reasons traders struggle to become consistently profitable. You''ll learn about common trading mistakes, emotional trading, overtrading, poor risk management, unrealistic profit expectations, and the importance of having a proper trading plan. 📊

Whether you''re a Crypto trader, Forex trader, beginner, or experienced trader, understanding these mistakes can help you develop a more disciplined and structured approach to trading.

🔥 In this video, you''ll learn:
✅ Why most traders lose money
✅ Common Forex & Crypto trading mistakes
✅ The impact of trading psychology
✅ Why overtrading can hurt your results
✅ Risk management basics
✅ How emotions affect trading decisions
✅ Why a proper trading plan matters
✅ How to develop better trading discipline', 0),
  ('Perpetual Contracts & Funding Rate Explained — Crypto Futures Trading for Beginners', 'video', '6.10', 'https://youtu.be/69HCnOzT534', 'Perpetual Contracts kya hain aur Funding Rate kaise work karta hai? 🤔📊

Agar aap Crypto Futures Trading start kar rahe hain, to Perpetual Contracts aur Funding Rate ko samajhna bohat important hai.

Is video mein hum simple language mein explain karenge:

🔹 Perpetual Contracts kya hote hain?
🔹 Perpetual Futures aur normal Futures mein kya difference hai?
🔹 Funding Rate kya hota hai?
🔹 Positive Funding Rate ka kya matlab hai?
🔹 Negative Funding Rate ka kya matlab hai?
🔹 Long traders funding kab pay karte hain?
🔹 Short traders funding kab pay karte hain?
🔹 Funding Rate trading aur market sentiment ko kaise affect kar sakta hai?
🔹 Funding Rate ko Crypto analysis mein kaise use kiya ja sakta hai?

Perpetual contracts ki expiry date nahi hoti, aur funding mechanism contract price ko underlying spot price ke qareeb rakhne mein help karta hai.', 1),
  ('Futures Trading Success: The Real Secrets Most Traders Ignore', 'video', '6.38', 'https://youtu.be/3HkPFkxfWc8', 'Futures Trading mein consistent results ka asal raaz kya hai? 📊

Futures market mein sirf market direction predict karna enough nahi hota. Risk management, leverage control, position sizing, market structure, execution discipline aur trading psychology mil kar ek robust trading framework banate hain.

Is advanced-level TradeEd video mein hum discuss karenge:

🔹 Futures trading mein consistency ka real framework
🔹 Leverage aur position sizing ka professional approach
🔹 Risk-to-Reward aur capital protection
🔹 Stop-loss placement aur trade invalidation
🔹 Overtrading aur revenge trading ko control karna
🔹 Market structure aur liquidity ko read karna
🔹 Funding rate aur derivatives data ka role
🔹 Trading psychology aur execution discipline
🔹 High-probability setups ke liye patience
🔹 Strategy se zyada risk control aur execution kyun matter karte hain

Agar aap Crypto Futures ya Forex trading ko serious level par approach karna chahte hain, to ye concepts aapke overall trading framework ka important part hain.', 2),
  ('Margin vs Leverage in Trading Explained — The Real Mechanics Behind Leveraged Positions', 'video', '6.98', 'https://youtu.be/sXktM-SmrKU', 'Margin aur Leverage trading mein asal mein kaise kaam karte hain? 📊

Leveraged trading ko properly understand karne ke liye sirf “10x leverage” ka concept samajhna enough nahi. Aapko margin requirement, position size, leverage ratio, liquidation aur risk exposure ke relationship ko clearly understand karna hota hai.

Is advanced-level TradeEd video mein hum cover karenge:

🔹 Margin kya hota hai?
🔹 Leverage kya hota hai?
🔹 Margin aur leverage mein fundamental difference
🔹 Position size aur required margin ka relationship
🔹 5x, 10x aur 20x leverage ka practical mechanism
🔹 Initial margin vs position exposure
🔹 Leverage increase karne se liquidation risk kaise change hota hai
🔹 Margin utilization aur risk management
🔹 Leverage ko profit ke saath loss exposure se bhi kyun relate karna chahiye
🔹 Futures trading mein leverage ko intelligently use karne ka framework

Ye video Crypto Futures aur leveraged Forex trading ko advanced perspective se samajhne ke liye hai.', 3),
  ('Crypto Value & Market Cap Explained — Coin Ki Real Value Kaise Samjhein?', 'video', '10.42', 'https://youtu.be/ZfLQ4W27urU', 'Crypto ki value aur Market Cap mein kya difference hai? 📊

Kisi cryptocurrency ki price dekh kar uski actual market position ka andaza lagana enough nahi hota. Market Cap, Circulating Supply aur Coin Price ko ek saath samajhna zaroori hai.

Is advanced-level TradeEd video mein hum detail mein samjhenge:

🔹 Crypto ki market value kya hoti hai?
🔹 Market Cap kya hai aur kaise calculate hota hai?
🔹 Coin Price × Circulating Supply ka relationship
🔹 High-price coin aur high-market-cap coin mein difference
🔹 Circulating Supply, Total Supply aur Max Supply
🔹 Token supply market valuation ko kaise affect karti hai
🔹 Market Cap ko different cryptocurrencies compare karne ke liye kaise use karein
🔹 Low Market Cap vs Large Market Cap assets
🔹 FDV (Fully Diluted Valuation) kya hai?
🔹 Market Cap aur FDV ko trading/investment analysis mein kaise interpret karein
🔹 Sirf coin ki price dekhna misleading kyun ho sakta hai', 4),
  ('Short Selling Explained: How Traders Profit When Crypto & Forex Prices Fall', 'video', '7.57', 'https://youtu.be/lSdhWYELGEA', 'Short Selling se profit kaise banta hai jab market neeche ja rahi ho? 📉💰

Short selling trading ka ek important mechanism hai jahan trader price decline se potential profit capture karne ki koshish karta hai. Lekin short position ko properly understand karne ke liye entry, exit, position size, leverage, margin aur risk ko ek saath samajhna zaroori hai.

Is advanced-level TradeEd video mein hum detail mein cover karenge:

🔹 Short selling ka actual mechanism
🔹 Sell First → Buy Back Lower ka concept
🔹 Short position mein profit aur loss ka calculation
🔹 Entry price aur exit price ka relationship
🔹 Margin aur leverage ka short positions par effect
🔹 Short squeeze kya hota hai?
🔹 Liquidation risk in leveraged shorts
🔹 Stop-loss aur position sizing
🔹 Crypto Futures aur Forex mein short selling ka practical framework
🔹 Falling market ko trade karte waqt key risk factors', 5),
  ('Can Arbitrage Control Trading Losses? — Advanced Crypto Arbitrage Strategy', 'video', '6.52', 'https://youtu.be/FcKyWN1Icsc', 'Kya Arbitrage strategy trading losses ko control karne mein help kar sakti hai? 📊

Arbitrage ko aksar relatively lower-risk trading approach ke taur par discuss kiya jata hai, lekin arbitrage risk-free nahi hota. Price differences ke saath execution speed, fees, slippage, liquidity, funding, transfer delays aur exchange risk bhi important factors hain.

Is advanced-level TradeEd video mein hum explore karenge:

🔹 Arbitrage trading ka actual mechanism
🔹 Price inefficiency se opportunity kaise identify hoti hai
🔹 Spot vs Futures Arbitrage
🔹 Funding Rate Arbitrage
🔹 Cross-Exchange Arbitrage
🔹 Spread aur transaction costs ka calculation
🔹 Slippage aur liquidity risk
🔹 Execution aur latency risk
🔹 Exchange/counterparty risk
🔹 Hedging ke through directional exposure ko kaise manage kiya jata hai
🔹 Arbitrage strategy ki practical limitations
🔹 Arbitrage ko risk-management framework ke andar kaise evaluate karein

🎯 Important: Arbitrage potential losses ko eliminate nahi karta. Strategy ka objective specific market inefficiencies ko capture karna ho sakta hai, while execution aur other risks remain.', 6),
  -- Module 2: lessons 32-37
  ('DeFi Explained: Complete Guide to Decentralized Finance — How DeFi Actually Works', 'video', '6.93', 'https://youtu.be/2OuqetilGl0', 'DeFi kya hai aur Decentralized Finance ka poora ecosystem kaise work karta hai? 🌐📊

DeFi (Decentralized Finance) blockchain-based financial applications aur protocols ka ecosystem hai jo traditional financial intermediaries ke baghair lending, borrowing, trading, liquidity provision aur other financial activities enable karta hai.

Is advanced-level TradeEd video mein hum DeFi ko end-to-end understand karenge:

🔹 DeFi kya hai aur iska core concept
🔹 CeFi vs DeFi — fundamental differences
🔹 Smart Contracts ka role
🔹 DEXs (Decentralized Exchanges) kaise work karte hain
🔹 AMMs aur Liquidity Pools
🔹 LP Tokens aur Liquidity Providing
🔹 DeFi Lending & Borrowing
🔹 Collateral, LTV aur Liquidation
🔹 Yield Farming aur Staking ka difference
🔹 Impermanent Loss kya hota hai
🔹 DeFi mein APY/APR ko kaise evaluate karein
🔹 Oracle ka role aur Oracle Risk
🔹 Smart Contract Risk & Protocol Exploits
🔹 Stablecoins aur DeFi ecosystem
🔹 Gas Fees aur transaction execution
🔹 DeFi mein liquidity aur capital efficiency
🔹 DeFi opportunities ko evaluate karne ka practical framework

🎯 Key takeaway: DeFi sirf decentralized trading nahi hai. Ye blockchain-based financial infrastructure ka broad ecosystem hai—jahan opportunities ke saath smart-contract, liquidity, oracle, protocol aur market risks bhi exist karte hain.', 7),
  ('Crypto Trading Bots: The Secrets You Need to Know Before Using Them', 'video', '8.33', 'https://youtu.be/4kU6dZ18JzY', 'Crypto Trading Bots ke woh important secrets aur mechanics jo har serious trader ko samajhne chahiye. 🤖📊

Trading bot sirf buy aur sell automatically execute karne wala software nahi hota. Bot ki performance uske strategy logic, market regime, execution, fees, slippage, liquidity aur risk management par depend karti hai.

Is advanced-level TradeEd video mein hum explore karenge:

🔹 Crypto trading bots actually kaise work karte hain
🔹 Rule-Based vs Algorithmic Trading
🔹 Grid, DCA, Trend-Following aur Arbitrage bots
🔹 Bot strategy aur underlying market assumptions
🔹 Backtesting vs Live Performance
🔹 Overfitting aur curve-fitting ka hidden risk
🔹 Transaction fees aur slippage ka impact
🔹 Latency, liquidity aur execution risk
🔹 Stop-loss, position sizing aur drawdown control
🔹 Market regime change hone par bot kyun fail ho sakta hai
🔹 API keys aur exchange security risks
🔹 Bot ko evaluate karne se pehle kin metrics ko check karna chahiye
🔹 Automation aur risk management ka relationship

🎯 Key takeaway: Automation profitable strategy ka substitute nahi. Ek bot sirf us logic ko execute karta hai jo usmein program kiya gaya ho—agar underlying strategy weak ho ya market conditions change ho jayein, automation losses ko bhi accelerate kar sakti hai.', 8),
  ('Crypto Risk Management: 12 Rules Every Serious Trader Must Know', 'video', '7.25', 'https://youtu.be/7odg4e-ADN0', 'Crypto trading mein survival aur long-term consistency ke liye Risk Management kyun sab se important hai? 📊

Market analysis aapko opportunity identify karne mein help karta hai, lekin risk management decide karta hai ke ek wrong trade aapke capital ko kitna impact karega.

Is advanced-level TradeEd video mein hum 12 essential Crypto Risk Management rules discuss karenge:

🔹 Position sizing ka correct framework
🔹 Risk per trade ko define karna
🔹 Stop-loss placement aur invalidation
🔹 Risk-to-Reward ratio
🔹 Leverage aur liquidation risk
🔹 Portfolio exposure management
🔹 Correlated positions ka hidden risk
🔹 Drawdown ko control karna
🔹 Overtrading aur revenge trading
🔹 Volatility ke according position adjust karna
🔹 Capital preservation aur risk of ruin
🔹 Trading journal aur performance review

🎯 Key takeaway: Profitable setup identify karna important hai, lekin serious trading mein capital preservation, controlled risk aur consistent execution equally critical hain.', 9),
  ('What Successful Traders Do Differently — 10 Things Most Traders Don''t Know', 'video', '5.85', 'https://youtu.be/jUk1ZcYTcQI', 'Successful traders aakhir aisa kya different karte hain jo aksar traders overlook kar dete hain? 📊🧠

Trading mein sirf strategy, indicators ya market predictions kaafi nahi hote. Consistent traders apne risk, execution, psychology, data aur decision-making process ko systematically manage karte hain.

Is advanced-level TradeEd video mein hum explore karenge:

🔹 Successful traders ka decision-making process
🔹 Risk ko profit se pehle kyun prioritize kiya jata hai
🔹 Position sizing aur controlled exposure
🔹 High-quality setups ka wait karna
🔹 Trading journal aur performance data ka use
🔹 Win rate ke bajaye expectancy ko samajhna
🔹 Drawdown ko manage karna
🔹 Overtrading aur emotional decisions se bachna
🔹 Market conditions ke according strategy adapt karna
🔹 Backtesting aur forward-testing ka role
🔹 Losses ko trading process ka part samajhna
🔹 Discipline, consistency aur execution

🎯 Key takeaway: Professional trading ka focus har trade ko win karna nahi, balki positive expectancy, controlled risk aur repeatable decision-making process develop karna hai.', 10),
  ('Backtesting Trading Strategy: How to Properly Test & Validate Your Strategy', 'video', '6.43', 'https://youtu.be/quWYuMowYLU', 'Apni trading strategy ko live capital risk karne se pehle objectively kaise test karein? 📊

Backtesting sirf historical chart par kuch winning trades dhoondhne ka naam nahi. Proper backtest mein clear rules, historical data, execution assumptions, risk parameters aur statistical performance ko systematically evaluate kiya jata hai.

Is advanced-level TradeEd video mein hum detail mein cover karenge:

🔹 Backtesting kya hai aur iska actual purpose
🔹 Strategy ke entry & exit rules ko clearly define karna
🔹 Historical data aur suitable timeframe select karna
🔹 Entry, Stop-Loss aur Take-Profit rules
🔹 Position sizing aur risk per trade
🔹 Trading fees, spread aur slippage ko include karna
🔹 Win Rate vs Expectancy
🔹 Profit Factor, Average R aur Drawdown
🔹 Maximum Drawdown aur Risk of Ruin
🔹 Sample size kitna important hai
🔹 Overfitting & Curve Fitting se bachna
🔹 In-sample vs Out-of-sample testing
🔹 Backtesting ke baad Forward Testing / Paper Trading
🔹 Strategy ko optimize karte waqt data-mining bias se bachna

🎯 Key takeaway: Ek backtest ka purpose past profits prove karna nahi, balki ye determine karna hai ke strategy ke rules historical conditions mein repeatable statistical edge show karte hain ya nahi.', 11),
  ('Complete Trading Guide: From Market Analysis to Professional Execution', 'video', '6.68', 'https://youtu.be/-8hdhdY7XWM', 'Trading ko systematically kaise approach kiya jata hai? 📊

Successful trading sirf kisi indicator ya ek strategy ka naam nahi. Ek complete trading framework mein market structure, analysis, setup selection, risk management, execution, psychology aur performance evaluation sab interconnected hote hain.

Is advanced-level TradeEd video mein hum complete trading framework ko step-by-step cover karenge:

🔹 Financial markets aur price behavior ko understand karna
🔹 Market Structure & Price Action
🔹 Technical vs Fundamental Analysis
🔹 Liquidity, Volatility aur Market Regimes
🔹 Trading Setup aur Entry Model develop karna
🔹 Stop-Loss, Take-Profit aur Position Sizing
🔹 Risk-to-Reward aur Trade Expectancy
🔹 Leverage, Margin aur Liquidation Risk
🔹 Backtesting aur Forward Testing
🔹 Trading Psychology & Emotional Control
🔹 Trading Journal aur Performance Metrics
🔹 Drawdown Management
🔹 Strategy Optimization aur Overfitting se bachna
🔹 Consistent execution ke liye complete trading plan

🎯 Key takeaway: Professional trading ka objective har market move ko trade karna nahi, balki ek defined, testable aur risk-controlled process ke through high-quality opportunities ko execute karna hai.', 12)
) AS v(title, type, duration, video_url, content, ord);

-- Verify:
-- select c.title, m.title, count(l.id) from courses c join modules m on m.course_id=c.id join lessons l on l.module_id=m.id where c.level='advanced' group by 1,2 order by 1,2;
