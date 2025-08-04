# Contract Website - Tailwind CSS Setup

This project is a contract/agreement page that combines custom CSS styles with Tailwind CSS utility classes.

## 📁 Project Structure

```
Contract/
├── index.html          # Main HTML file
├── styles.css          # Source CSS file (custom styles + Tailwind import)
├── output.css          # Generated optimized CSS file
├── package.json        # Node.js dependencies
└── README.md          # This file
```

## 🚀 Installation and Setup

### 1. Install Required Packages

```bash
npm install tailwindcss @tailwindcss/cli
```

### 2. Start Tailwind CSS Build Process

Run the following command to start the Tailwind CSS build process:

```bash
npx @tailwindcss/cli -i ./styles.css -o ./output.css --watch
```

#### Command Explanation:

- **`-i ./styles.css`**: Input file (source CSS)
- **`-o ./output.css`**: Output file (generated CSS)
- **`--watch`**: Watches for file changes and automatically rebuilds

### 3. What Does the Build Process Do?

1. **Scanning**: Scans your HTML files to detect used Tailwind classes
2. **Optimization**: Includes only the CSS classes you actually use in the output file
3. **Merging**: Combines your custom CSS styles with Tailwind utility classes
4. **Generation**: Creates an optimized `output.css` file

## 📝 File Contents

### styles.css (Input)

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
@import "tailwindcss";

/* Custom CSS styles go here */
.gradient-border::before {
  content: "";
  position: absolute;
  /* ... other styles */
}
```

### output.css (Generated)

The optimized CSS file created after the build process. This file:

- Contains only the Tailwind classes you use
- Preserves your custom CSS styles
- Provides production-ready optimized code

## 🌐 Deployment

Required files for deployment:

- `index.html`
- `output.css` (built file)

### Deployment Platforms:

- **GitHub Pages**: Free static hosting
- **Netlify**: Drag & drop deployment
- **Vercel**: Automatic deployment

## ⚡ Development Workflow

1. **During development**:

   ```bash
   npx @tailwindcss/cli -i ./styles.css -o ./output.css --watch
   ```

2. **For production build**:
   ```bash
   npx @tailwindcss/cli -i ./styles.css -o ./output.css --minify
   ```

## 🔧 CSS Usage in HTML

```html
<head>
  <!-- Use the built CSS file -->
  <link href="./output.css" rel="stylesheet" />
</head>
```

## 📖 Tailwind CSS CLI Reference

For detailed information: [Tailwind CSS CLI Documentation](https://tailwindcss.com/docs/installation/tailwind-cli)

### Basic Commands:

```bash
# Watch mode (development)
npx @tailwindcss/cli -i ./styles.css -o ./output.css --watch

# Production build (minified)
npx @tailwindcss/cli -i ./styles.css -o ./output.css --minify

# One-time build
npx @tailwindcss/cli -i ./styles.css -o ./output.css
```

## 🎯 Why This Approach?

- **Performance**: Only includes CSS classes you actually use
- **Flexibility**: Combine custom CSS styles with Tailwind
- **Optimization**: Production-ready, minified CSS output
- **Developer Experience**: IntelliSense support + automatic builds

## 🚨 Important Notes

- Edit the `styles.css` file, **do not directly modify** the `output.css` file
- Without the build process, only IntelliSense works - no CSS file is generated
- With watch mode enabled, your file changes are automatically built

## 🏗️ How Tailwind CSS Works

Tailwind CSS works by:

1. **Scanning** all your HTML files, JavaScript components, and templates for class names
2. **Generating** the corresponding styles for found classes
3. **Writing** them to a static CSS file
4. **Optimizing** the output for production use

This approach is **fast, flexible, and reliable** with zero runtime overhead.

## 📚 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Playground](https://play.tailwindcss.com/)
- [Tailwind CSS GitHub](https://github.com/tailwindlabs/tailwindcss)
- [Framework Guides](https://tailwindcss.com/docs/installation/framework-guides)
