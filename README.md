[🇧🇷 Leia em Português](README.pt-br.md)

# 🍽️ Accessible Self-Service Kiosk for Restaurants

## 📋 Description

Web prototype of a self-service kiosk for restaurants with a focus on **accessibility for visually impaired people**. Developed as an academic project for the Human-Computer Interaction (HCI) course.

The system implements concepts of inclusive design, multimodal navigation, and user-centered usability.

## 🌐 Online Demonstration

Access the prototype running directly in your browser via GitHub Pages:
[**Test Self-Service Kiosk**](https://lucasalexandremachado.github.io/Blind-FriendlyRestaurantOrderingSystem/)

## 🎯 Main Features

### Normal Mode
- Intuitive visual interface with large buttons
- Simple click navigation
- Floating cart for easy access
- Design inspired by fast-food kiosks
- Visual feedback on all actions

### Accessible Mode
- **High contrast**: Black background with yellow and white text
- **Text-to-Speech**: Audio output for all actions
- **Single-button navigation** with three actions:
  - **Short press**: Advances to the next option
  - **Long press**: Selects the current option
  - **Double press**: Returns to the previous screen
- **Visual and sound indicator**: Constantly shows the current state
- **Mouseless navigation**: Completely based on a single button
- **Screen reader compatibility**

## 🚀 How to Use

### 1. Requirements
- Modern browser with support for:
  - HTML5
  - CSS3
  - JavaScript ES6+
  - Web Speech API

### 2. Project Files
```
.
├── index.html        # HTML Structure
├── styles.css        # CSS Styles
├── app.js           # JavaScript Logic
├── cardapio.json    # Products Database
└── README.md        # This file
```

### 3. Run the Project

#### Option 1: Open directly
1. Navigate to the project folder
2. Open `index.html` in the browser

#### Option 2: Use a local server (recommended)
```bash
# With Python 3
python -m http.server 8000

# With Python 2
python -m SimpleHTTPServer 8000

# With Live Server (VS Code)
# Install the "Live Server" extension and click "Go Live"
```

Then access: `http://localhost:8000`

## 💻 Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Styles and animations
- **Vanilla JavaScript**: Logic without frameworks
- **Web Speech API**: Text-to-Speech
- **JSON**: Product data

## 📱 Usage Flow

### Normal Mode
1. Home screen with "Start Order" and "Accessible Mode" buttons
2. Select a product category
3. Choose desired products
4. View cart
5. Review order
6. Place order

### Accessible Mode
1. Click on "Accessible Mode" (or press the **Space** key on the home screen)
2. System enters high contrast mode
3. Single button appears in the bottom right corner
4. Navigate using:
   - **Short press**: Next option (the system speaks)
   - **Long press**: Select (with sound feedback)
   - **Double press**: Go back (with return sound)

**🗺️ System Navigation Map:**
- 🏠 **Main Menu**
  - 📖 **View Menu**
    - 📂 *Categories (e.g.: Burgers, Drinks...)*
      - 🍔 *Products (e.g.: Cheeseburger, Water...)*
        - ➕ Add +1
        - ➖ Remove -1
        - ✔️ Done (Confirms quantity and returns to list)
  - 🛒 **View Cart and Checkout**
    - 📝 *Cart Items (Long press removes 1 unit)*
    - ✔️ Place Order ➡️ *(Advances to Confirmation and finalizes)*
    - 🔄 Continue Shopping ➡️ *(Returns to Menu)*

## 🎨 Customization

### Add Products
Edit `cardapio.json`:

```json
{
  "categorias": [
    {
      "nome": "Your Category",
      "icone": "🍕",
      "itens": [
        {
          "nome": "Your Product",
          "descricao": "Product description",
          "preco": 25.00
        }
      ]
    }
  ]
}
```

### Modify Colors
In `styles.css`, edit the CSS variables:

```css
:root {
    --cor-primaria: #FF6B35;      /* Orange */
    --cor-secundaria: #004E89;    /* Blue */
    --cor-fundo: #F7F7F7;         /* Light gray */
    --cor-texto: #333;            /* Black */
    --cor-destaque: #FFD700;      /* Gold yellow */
}
```

### Adjust Audio Language
In `app.js`, modify `utteranceConfig`:

```javascript
const utteranceConfig = {
    rate: 1,      // Speed (0.5 = slow, 2 = fast)
    pitch: 1,     // Pitch (0.5 = low, 2 = high)
    volume: 1,    // Volume (0 = muted, 1 = max)
    lang: 'pt-BR' // Language
};
```

## ♿ Implemented Accessibility Concepts

1. **Multisensory Feedback**
   - Visual: Color changes, animations
   - Auditory: Text-to-Speech for all actions
   - Sensorial: Indicator animations

2. **System Status Visibility**
   - Visual indicator shows current position
   - Audio continuously describes the state
   - Visual highlight of the selected option

3. **Mouseless Navigation**
   - Single button with three actions
   - All functions accessible
   - No keyboard needed

4. **High Contrast**
   - Black background, white/yellow text
   - Reinforced borders
   - Large fonts (up to 56px)

5. **Robustness and Precision (Anti-Ghosting)**
   - Use of `Pointer Events` to unify mouse, touch, and pen interactions without duplication.
   - *Debounce* algorithm for the accessibility button, filtering tremors or accidental double clicks.
   - Compatible with screen readers
   - No plugins required
   - Works offline (except Web Speech)

## 🧠 Applied HCI Guidelines and Heuristics

The project was designed respecting fundamental Human-Computer Interaction principles, aligned with **Nielsen's Heuristics**:

1. **Visibility of system status**: The user is constantly informed about the current state through Text-to-Speech audio and visual indicators (e.g.: "You are in the cart with 3 items").
2. **User control and freedom**: Navigation offers clear exits at any time. The "double press" action ensures the user can always go back, cancel an action, and never feel trapped in a flow.
3. **Consistency and standards**: The interaction logic of the accessible mode maintains the exact same behavior across all application screens (short = next, long = select, double = back).
4. **Error prevention**: Logical blocks like "empty cart" or "maximum stock limit", coupled with *debounce* to filter accidental clicks on the single button.
5. **Recognition rather than recall**: The system iteratively reads all available options on the screen, as well as reviews cart items, not requiring the user to memorize navigation.
6. **Aesthetic and minimalist design**: The accessible mode eliminates visual noise, focusing on high contrast (black/yellow/white) and large fonts purely for readability and clarity for low vision users.

## 🧪 Testing

### Test Normal Mode
1. Open the application
2. Click "Start Order"
3. Navigate through categories and products
4. Add to cart
5. Place order

### Test Accessible Mode
1. Open the application
2. Click "Accessible Mode"
3. Use the single button:
   - Short press 3-4 times to navigate
   - Long press to select
   - Double press to go back
4. Verify audio in each action

### Test Without Sound
1. Enable screen reader (NVDA/JAWS on Windows, VoiceOver on Mac)
2. Navigate only by audio
3. Verify option descriptions

## 📊 Data Structure

### Product
```javascript
{
  nome: String,           // Product name
  descricao: String,      // Detailed description
  preco: Number           // Price in BRL
}
```

### Category
```javascript
{
  nome: String,           // Category name
  icone: String,          // Emoji
  itens: Array<Produto>   // List of products
}
```

## 📚 References on HCI

- [Nielsen Norman Group - Accessibility](https://www.nngroup.com/articles/accessibility/)
- [W3C - Web Accessibility Initiative](https://www.w3.org/WAI/)
- [Web Speech API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

## 🎓 About the Project

This is an academic project developed for the **Human-Computer Interaction (HCI)** course at the **Federal University of Santa Catarina (UFSC)**.

### 👥 Team
- **Lucas Alexandre Machado** - [GitHub](https://github.com/LucasAlexandreMachado)
- **Arthur Silveira Sampaio** - [GitHub](https://github.com/sampaio-arthur)
- **Leonardo Latorre Boteon** - [GitHub](https://github.com/LeonardoBoteon)

## 📄 License

Open-source code for educational and commercial use.

---

**Developed with a focus on: Accessibility, Usability, and Digital Inclusion** ♿✨
