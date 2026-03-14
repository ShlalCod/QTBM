# Media Buyer Portfolio - Live KPI Dashboard

A production-ready, single-page portfolio website for a Media Buyer / Digital Marketer featuring an interactive Live KPI Dashboard with client-side campaign audit engine.

## 🚀 Quick Start

**No build step required!** Simply open `index.html` in your browser:

```bash
# Option 1: Direct file open
open index.html

# Option 2: Use a local server (recommended for full functionality)
python -m http.server 8000
# Then visit http://localhost:8000

# Option 3: Using Node.js
npx serve .
```

## 📁 Project Structure

```
portfolio-site/
├── index.html              # Main HTML file (single page)
├── css/
│   └── style.css           # Complete stylesheet with design tokens
├── js/
│   └── script.js           # Main JavaScript with audit engine
├── assets/                 # Images, icons, SVGs
│   └── icons/
├── data/
│   └── samples/
│       ├── sample_campaign.csv   # 50-row sample dataset
│       └── sample_campaign.json  # Same data in JSON format
├── design-tokens.json     # Design system documentation
└── README.md              # This file
```

## 🎯 Features

### Live KPI Dashboard

- **3 Input Methods**: Manual form, CSV upload, JSON paste
- **Real-time Visualizations**: Time series charts, funnel charts, event comparisons
- **Audit Engine**: 15 deterministic checks with severity rankings
- **Export Options**: PDF and JSON export
- **Privacy-First**: All data processed client-side

### Portfolio Sections

1. **Hero** - Professional introduction with key stats
2. **Live KPI Dashboard** - Interactive campaign analysis
3. **About** - Profile and certifications
4. **Skills** - Grouped skill cards
5. **Projects** - 5 case studies with modals
6. **Experience** - Timeline layout
7. **Services** - Service offerings
8. **Career Objective** - Mission statement
9. **Contact** - Form and social links
10. **Footer** - Navigation and copyright

### Design System

- **Dark mode default** with light mode toggle
- **Responsive** for mobile, tablet, desktop
- **Accessible**: WCAG AA contrast, ARIA labels, keyboard navigation
- **Animations**: Fade-in, hover effects, skeleton loaders
- **Reduced motion**: Respects `prefers-reduced-motion`

## 📊 How to Use the Dashboard

### Loading Data

#### Option 1: Manual Entry
1. Click "Manual Entry" tab
2. Fill in campaign metrics
3. Click "Run Audit"

#### Option 2: CSV Upload
1. Click "Upload CSV" tab
2. Drag & drop or browse for CSV file
3. Preview the data
4. Click "Run Audit"

#### Option 3: JSON Paste
1. Click "Paste JSON" tab
2. Paste JSON array of campaign data
3. If fields don't match, use the mapping tool
4. Click "Run Audit"

#### Option 4: Sample Data
1. Click "Load Sample Data" button
2. 50-row demo dataset loads automatically
3. Dashboard populates with charts and audit

### CSV Format

```csv
date,campaign,adset,ad,spend,clicks,impressions,purchases,revenue,currency,utm_campaign,pixel_events,server_events,transaction_id,page_load_time,ad_copy
2024-01-01,Summer_Sale,Audience_A,Video_1,1250.50,3420,125000,45,8950.00,USD,summer_sale,44,45,TXN001,1.2,"Ad copy text"
```

### JSON Format

```json
[
  {
    "date": "2024-01-01",
    "campaign": "Summer_Sale",
    "adset": "Audience_A",
    "ad": "Video_1",
    "spend": 1250.50,
    "clicks": 3420,
    "impressions": 125000,
    "purchases": 45,
    "revenue": 8950.00,
    "currency": "USD",
    "utm_campaign": "summer_sale",
    "pixel_events": 44,
    "server_events": 45,
    "transaction_id": "TXN001",
    "page_load_time": 1.2,
    "ad_copy": "Ad copy text"
  }
]
```

## 🔧 Audit Engine Configuration

### Default Thresholds

| Setting | Default | Description |
|---------|---------|-------------|
| ROAS Threshold | 1.5x | Flag campaigns below this |
| CPA Multiplier | 1.3x | Flag when CPA > target × multiplier |
| Min Conversions | 30 | Warn if total below this |
| Event Mismatch | 25% | Max pixel/server variance |
| Funnel Drop-off | 60% | Flag stages with this drop-off |
| Page Speed | 3s | Warn if load time exceeds |

### Changing Thresholds

1. Click the ⚙️ Settings button in the dashboard
2. Adjust values in the settings panel
3. Click "Apply Settings"
4. Re-run the audit to see updated results

## 🛠️ How to Add a New Audit Rule

Audit rules are defined in `js/script.js`. Each rule is a function that:

1. Takes `(data, config)` parameters
2. Returns a `finding` object or `null`

### Template Function

```javascript
/**
 * Audit Rule: [Your Rule Name]
 * [Brief description of what it checks]
 */
function checkYourRule(data, config) {
    // Your threshold from config
    const threshold = config.yourThreshold;
    
    // Find problematic data
    const problematicRows = data.filter(row => {
        // Your condition
        return row.someField > threshold;
    });
    
    // Return null if no issues found
    if (problematicRows.length === 0) return null;
    
    // Return finding object
    return {
        id: 'YOUR_RULE_ID',           // Unique identifier
        severity: 'P0',               // P0 (error), P1 (warning), P2 (info)
        type: 'error',                // 'error', 'warning', or 'info'
        title: 'Issue Title',
        description: 'Detailed description of the issue...',
        evidence: problematicRows.slice(0, 5).map(r => 
            `Row evidence: ${r.someField}`
        ),
        estimatedImpact: 'High/Medium/Low - Description of impact',
        confidence: 'High',           // 'High', 'Medium', or 'Low'
        recommendedFix: '1. Step one\n2. Step two\n3. Step three',
        fixSnippet: '// Optional code example\nconst fix = "example";'
    };
}
```

### Adding to Audit Pipeline

1. Add your function to `js/script.js`
2. Add it to the `runAudit()` function's findings array:

```javascript
function runAudit() {
    const findings = [
        checkMissingConversions(data, config),
        checkEventMismatch(data, config),
        // ... other checks ...
        checkYourRule(data, config),  // Add your rule here
    ].filter(f => f !== null);
    // ...
}
```

### Adding Configuration

If your rule needs a configurable threshold:

1. Add to `AppState.config`:

```javascript
const AppState = {
    config: {
        // ... existing config ...
        yourThreshold: 10  // Add your default
    },
    defaultConfig: null
};
```

2. Add to `initSettingsPanel()` in HTML and JS

3. Add to `loadSettingsToUI()` and `saveSettingsFromUI()`

## 🧪 Testing

### Unit Tests

Open browser console and run:

```javascript
runTests()
```

This executes lightweight assertions against:
- Missing conversions detection
- Event mismatch detection
- Low ROAS detection
- Duplicate transaction detection
- Currency/percent formatting
- HTML escaping
- Data normalization

### Manual Testing Checklist

- [ ] Open `index.html` directly - should work without server
- [ ] Toggle dark/light mode
- [ ] Load sample data
- [ ] Upload CSV file
- [ ] Paste JSON data
- [ ] View all charts
- [ ] Sort campaigns table
- [ ] Expand finding details
- [ ] Copy quick-fix to clipboard
- [ ] Export JSON report
- [ ] Export PDF report
- [ ] Share snapshot URL
- [ ] Open project modals
- [ ] Test on mobile viewport
- [ ] Navigate with keyboard only
- [ ] Test with screen reader

## 🌐 Deployment

### Static Hosting (Recommended)

Upload all files to any static hosting service:

**Netlify:**
```bash
# Drag and drop the portfolio-site folder to netlify.com/drop
```

**Vercel:**
```bash
npx vercel
```

**GitHub Pages:**
1. Push to GitHub repository
2. Settings → Pages → Source: main branch
3. Site will be live at `username.github.io/repo-name`

**Cloudflare Pages:**
1. Connect GitHub repository
2. Build command: (leave empty)
3. Output directory: `/`

### Custom Domain

1. Add CNAME record pointing to your hosting
2. Update canonical URL in `index.html`

## 📡 Optional Notion Integration

This section documents how to add server-side Notion sync. **Do not include API tokens in client code!**

### Serverless Function Template

Create a serverless function (e.g., Vercel, Netlify, AWS Lambda):

```javascript
// api/send-to-notion.js
const { Client } = require('@notionhq/client');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Verify auth token
    const authToken = req.headers.authorization?.replace('Bearer ', '');
    if (authToken !== process.env.NOTION_AUTH_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const { findings, summary } = req.body;

    try {
        // Create page in Notion database
        const response = await notion.pages.create({
            parent: { database_id: process.env.NOTION_DATABASE_ID },
            properties: {
                Title: { title: [{ text: { content: `Audit Report - ${new Date().toLocaleDateString()}` } }] },
                Status: { select: { name: 'New' } },
                'Total Spend': { number: summary.totalSpend },
                'Avg ROAS': { number: summary.avgROAS },
                'Issues Found': { number: findings.length },
                Date: { date: { start: new Date().toISOString() } }
            }
        });

        res.status(200).json({ success: true, pageId: response.id });
    } catch (error) {
        console.error('Notion API error:', error);
        res.status(500).json({ error: 'Failed to create Notion page' });
    }
}
```

### Client-Side Integration

Add to `js/script.js`:

```javascript
async function sendToNotion(findings, summary) {
    const response = await fetch('/api/send-to-notion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getUserToken()}` // From user session
        },
        body: JSON.stringify({ findings, summary })
    });
    
    if (!response.ok) throw new Error('Failed to send to Notion');
    return response.json();
}
```

### Environment Variables

Create `.env` file (never commit this!):

```env
NOTION_API_KEY=secret_xxxxx
NOTION_DATABASE_ID=xxxxx-xxxxx-xxxxx
NOTION_AUTH_TOKEN=your_custom_auth_token
```

### Security Considerations

1. **Never** put API keys in client-side code
2. Use authentication to prevent unauthorized access
3. Rate limit API calls
4. Validate and sanitize all inputs server-side
5. Log all API access for audit trail

## 🔒 Privacy & Security

### Data Processing

- **All data stays in browser** - nothing uploaded to servers
- CSV/JSON processed with FileReader API
- No cookies or tracking (except theme preference)
- No external API calls for data processing

### Security Best Practices

1. **No `eval()`** - JSON parsed with `JSON.parse()` only
2. **XSS Prevention** - All dynamic content escaped with `escapeHtml()`
3. **No Secrets** - No API tokens in client code
4. **CSP Ready** - Works with Content Security Policy headers

### Privacy Notice

Display in the dashboard:
> "Data is processed locally in your browser and not uploaded."

## 📦 Dependencies

### Required CDN Libraries

The site uses these CDN libraries (loaded in `<head>`):

```html
<!-- Chart.js - Visualizations -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>

<!-- PapaParse - CSV parsing -->
<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>

<!-- html2pdf.js - PDF export -->
<script src="https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js"></script>
```

### Fallback Behavior

- **Charts**: Display message if Chart.js unavailable
- **CSV**: Manual entry and JSON still work without PapaParse
- **PDF**: JSON export works without html2pdf

## 🎨 Customization

### Design Tokens

Edit CSS variables in `css/style.css`:

```css
:root {
    --primary: #0E7C86;      /* Brand color */
    --accent: #FF6B5F;       /* CTA color */
    --bg-dark: #0B1220;      /* Dark mode background */
    --success: #22C55E;      /* Positive states */
    --warning: #F59E0B;      /* Warning states */
    --danger: #EF4444;       /* Error states */
}
```

### Typography

The site uses Google Fonts:
- **Headings**: Poppins
- **Body**: Inter

To change, update the `<link>` in `index.html` and CSS variable.

### Adding Sections

1. Add HTML section in `index.html`
2. Add corresponding styles in `css/style.css`
3. Add navigation link in navbar

## 📈 Performance Targets

- **Lighthouse Score**: ≥85 (Desktop)
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1

### Optimization Tips

1. Lazy load images (add `loading="lazy"`)
2. Minimize third-party scripts
3. Use CSS containment for heavy components
4. Implement virtual scrolling for large tables

## 🐛 Troubleshooting

### Charts Not Loading

- Check browser console for Chart.js errors
- Verify CDN is accessible
- Try loading without server (some features need server)

### CSV Upload Issues

- Ensure CSV has headers matching expected format
- Check for special characters in data
- Try JSON upload instead

### PDF Export Blank

- Ensure html2pdf.js is loaded
- Check browser console for errors
- Try in different browser

### CORS Errors

- Use a local server instead of file:// protocol
- Or use a browser extension for development

## 📄 License

This project is provided as-is for portfolio demonstration purposes.

## 🙋 Support

For questions or issues, refer to:
1. This README
2. Code comments in `script.js` (especially audit rules section)
3. Browser developer console for errors

---

Built with ❤️ for media buyers who care about data privacy and actionable insights.
