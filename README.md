<img width="691" height="795" alt="openart-image_1775755360079_a1e0769a_1775755360132_79dff5bc" src="https://github.com/user-attachments/assets/28381b0c-aa4c-4328-a920-9a00d573f7ba" />


# Railroad Toasts

> Toast notifications and confirm dialogs for web applications.

**Part of the Railroad ecosystem** — Pure DOM utilities that work standalone or with [Railroad Runtime](https://github.com/faroncoder/railroad-runtime).

**Zero dependencies. ~3KB minified.**

---

## Features

✅ Toast notifications (success, error, warn, info)  
✅ Animated confirm dialogs  
✅ Auto-dismiss or click-to-dismiss  
✅ HTMX integration (optional)  
✅ Replaces `alert()` and `confirm()`  
✅ Smooth slide-in animations  
✅ Customizable colors and duration  

---

## Installation

**CDN (fastest):**
```html
<script src="https://unpkg.com/railroad-toasts@1.0.0/dist/toasts.min.js"></script>
```

**npm:**
```bash
npm install railroad-toasts
```

---

## Quick Start

### Basic Toast

```javascript
toast('Settings saved!', 'success');
toast('Something went wrong', 'error');
toast('Please review this', 'warn');
toast('Just so you know', 'info');
```

### Confirm Dialog

```javascript
confirm('Delete this item?').then(confirmed => {
  if (confirmed) {
    // User clicked "Confirm"
  }
});

// With custom button text
confirm('Deploy to production?', {
  confirmText: 'Deploy',
  cancelText: 'Cancel'
}).then(confirmed => {
  if (confirmed) {
    deploy();
  }
});
```

### Custom Duration

```javascript
// Show for 10 seconds
toast('Important message', 'warn', 10000);

// Never auto-dismiss (must click to dismiss)
toast('Permanent message', 'info', 0);
```

---

## API

### `toast(message, type, duration)`

Show a toast notification.

**Parameters:**
- `message` (string) - Text to display
- `type` (string) - Type: `'success'`, `'error'`, `'warn'`, `'info'` (default: `'info'`)
- `duration` (number) - Auto-dismiss duration in ms (default: 4000, use 0 for manual dismiss only)

**Example:**
```javascript
toast('File uploaded successfully', 'success');
```

---

### `confirm(message, options)`

Show a confirm dialog.

**Parameters:**
- `message` (string) - Question to ask
- `options` (object, optional):
  - `confirmText` (string) - Text for confirm button (default: 'Confirm')
  - `cancelText` (string) - Text for cancel button (default: 'Cancel')

**Returns:** `Promise<boolean>` - Resolves to `true` if confirmed, `false` if canceled

**Example:**
```javascript
confirm('Delete this user?', {
  confirmText: 'Delete',
  cancelText: 'Keep'
}).then(result => {
  if (result) {
    deleteUser();
  }
});
```

---

## HTMX Integration

Railroad Toasts automatically integrates with HTMX if present:

### 1. Override `hx-confirm`

```html
<button hx-delete="/api/users/123" hx-confirm="Delete this user?">
  Delete
</button>
```

The confirm dialog will appear automatically (no default `confirm()` popup).

### 2. Show Toast via Response Header

**Backend (any framework):**
```python
# Django
response['HX-Trigger'] = json.dumps({"toast": {"message": "User deleted", "type": "success"}})

# Express.js
res.header('HX-Trigger', JSON.stringify({toast: {message: 'User deleted', type: 'success'}}));
```

**Frontend:** Toast appears automatically.

### 3. Error Handling

Toasts automatically appear for HTMX errors:
- `htmx:responseError` → Shows "Request failed (HTTP 500)"
- `htmx:sendError` → Shows "Network error — server unreachable"

---

## Styling

### Default Colors

- **Success:** Green (`#16a34a`)
- **Error:** Red (`#dc2626`)
- **Warn:** Amber (`#d97706`)
- **Info:** Blue (`#2563eb`)

### Customize Colors

```javascript
// Modify color palette
RailroadToasts.colors.success.bg = 'rgba(34, 197, 94, 0.95)';
RailroadToasts.colors.success.border = '#22c55e';
```

### Position

Toasts appear in the **top-right** by default. Modify via CSS:

```css
#railroad-toast-container {
  top: 20px !important;
  right: 20px !important;
  /* Or change to bottom-left: */
  /* bottom: 20px !important; */
  /* left: 20px !important; */
}
```

---

## Examples

### Replace `alert()` Globally

```javascript
// This happens automatically when railroad-toasts loads
alert('This will be a toast!');  // Shows red error toast
```

### Form Validation

```javascript
document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const confirmed = await confirm('Submit this form?');
  if (!confirmed) return;
  
  try {
    await fetch('/api/submit', {method: 'POST', body: new FormData(e.target)});
    toast('Form submitted successfully', 'success');
  } catch (err) {
    toast('Submission failed', 'error');
  }
});
```

### Progress Notifications

```javascript
toast('Starting upload...', 'info');

uploadFile().then(() => {
  toast('Upload complete!', 'success');
}).catch(err => {
  toast('Upload failed: ' + err.message, 'error');
});
```

---

## Works With

✅ Vanilla JavaScript (no dependencies)  
✅ HTMX (optional integration)  
✅ Alpine.js  
✅ Turbo/Hotwire  
✅ Any framework or no framework  

---

## Why Railroad Toasts?

**Other libraries:**
- Require configuration
- Large bundle sizes
- Complex APIs
- Framework dependencies

**Railroad Toasts:**
- Works out of the box
- ~3KB minified
- One function: `toast(msg, type)`
- Zero dependencies

**One line to get started:**
```html
<script src="https://unpkg.com/railroad-toasts"></script>
```

---

## License

MIT

## Contributing

Issues and PRs welcome at https://github.com/faroncoder/railroad-toasts

---

**Part of the Railroad ecosystem:**
- [Railroad Runtime](https://github.com/faroncoder/railroad-runtime) - Governed execution substrate
- **Railroad Toasts** - This package
- [Railroad Loader](https://github.com/faroncoder/railroad-loader) - Animated loaders

**Not a framework. Just utilities.**
