# Epic Games Free Games API

An API scraper for fetching free games and mystery games from the Epic Games Store.

## Features

- 🎮 Fetch currently free games from Epic Games Store
- 🎁 Detect and track upcoming mystery/locked games
- ⏰ Countdown timers for game expiry and unlock times
- 📊 Comprehensive game metadata (developer, publisher, genres, features)
- 🖼️ Multiple image formats (thumbnail, portrait, landscape, logo)
- 🔄 Real-time data from Epic's official API

## Installation

```bash
# Clone the repository
git clone https://github.com/mithun-ctrl/epci-games-scraper.git

# Navigate to project directory
cd epci-games-scraper

# Install dependencies
npm install
```

## Configuration

Create a `config.js` file in your `utils` folder:

```javascript
const Config = {
    PORT: 3000,
    EPIC_URL: "https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US"
};

export default Config;
```

## Usage

### Start the Server

```bash
npm start
```

The API will be available at `http://localhost:3000` (or your configured port).

### API Endpoints

#### Get Free Games

```http
GET /api/free-games
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "title": "Game Title",
      "description": "Game description",
      "longDescription": "Extended game description",
      "developer": "Developer Name",
      "publisher": "Publisher Name",
      "seller": "Seller Name",
      "genres": ["Action", "Adventure"],
      "features": ["Single Player", "Controller Support", "Cloud Saves"],
      "ageRating": "ESRB:T",
      "images": {
        "thumbnail": "https://...",
        "portrait": "https://...",
        "landscape": "https://...",
        "logo": "https://...",
        "featured": "https://..."
      },
      "releaseDate": "2024-01-01T00:00:00.000Z",
      "url": "https://store.epicgames.com/en-US/p/game-slug",
      "originalPrice": 2999,
      "discountPrice": 0,
      "currencyCode": "USD",
      "expiryDate": "2024-12-26T16:00:00.000Z",
      "timeRemaining": {
        "days": 7,
        "hours": 168,
        "humanReadable": "7d 0h"
      }
    }
  ]
}
```

#### Get Mystery/Locked Games

```http
GET /api/mystery-games
```

**Response:**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "title": "Mystery Game",
      "isMystery": true,
      "description": "A mystery game awaiting reveal",
      "productSlug": "free-game-promotion",
      "images": {
        "vault": "https://...",
        "wide": "https://...",
        "thumbnail": "https://...",
        "tall": "https://..."
      },
      "unlockDate": "2024-12-26T16:00:00.000Z",
      "expiryDate": "2025-01-02T16:00:00.000Z",
      "timeUntilUnlock": {
        "days": 7,
        "hours": 168,
        "humanReadable": "7d 0h"
      },
      "status": "UPCOMING"
    }
  ]
}
```

## Data Fields

### Free Games

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Game title |
| `description` | String | Short description |
| `longDescription` | String | Extended description |
| `developer` | String | Game developer |
| `publisher` | String | Game publisher |
| `genres` | Array | Game genres/categories |
| `features` | Array | Game features (multiplayer, co-op, etc.) |
| `ageRating` | String | Age rating (ESRB, PEGI) |
| `releaseDate` | String | Original release date |
| `expiryDate` | String | When the free offer ends |
| `timeRemaining` | Object | Countdown until expiry |

### Mystery Games

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | "Mystery Game" or revealed title |
| `isMystery` | Boolean | Whether game is still locked |
| `unlockDate` | String | When the game will be revealed |
| `expiryDate` | String | When the free offer ends |
| `timeUntilUnlock` | Object | Countdown until reveal |
| `status` | String | "UPCOMING" or "AVAILABLE" |

## Project Structure

```
.
├── routes/
│   └── epic.js              # API route handlers
├── scraper/
│   ├── free-games.js        # Free games scraper
│   └── mystery-games.js     # Mystery games scraper
├── utils/
│   └── config.js            # Configuration
└── server.js                # Express server setup
```

## Features Detection

The API automatically detects game features based on Epic's tags:

- **Single Player** - Tag ID: 1264
- **Multiplayer** - Tag ID: 1203
- **Co-op** - Tag ID: 1299
- **Controller Support** - Tag ID: 1370
- **Cloud Saves** - Tag ID: 9547

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Dependencies

- `express` - Web framework
- `axios` - HTTP client

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This is an unofficial API scraper and is not affiliated with Epic Games. Use responsibly and in accordance with Epic Games' Terms of Service.

## Acknowledgments

- Data provided by Epic Games Store public API
- Inspired by the Epic Games free games promotion

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Note:** Epic Games' API structure may change without notice. This wrapper is maintained on a best-effort basis.