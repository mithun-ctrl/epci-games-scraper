import axios from "axios";
import Config from "../utils/config.js";

const getMysteryGames = async () => {
    try {
        const response = await axios.get(Config.EPIC_URL);
        const elements = response.data.data.Catalog.searchStore.elements;

        console.log(`Total elements found: ${elements.length}`);

        // Debug: Log all games with upcoming promotions
        const gamesWithUpcoming = elements.filter(game =>
            game.promotions?.upcomingPromotionalOffers?.length > 0
        );

        console.log(`Games with upcoming offers: ${gamesWithUpcoming.length}`);
        gamesWithUpcoming.forEach(game => {
            console.log(`- Title: "${game.title}", Slug: "${game.productSlug}", UrlSlug: "${game.urlSlug}"`);
        });

        const mysteryGames = elements.filter(game => {
            const hasUpcoming = game.promotions?.upcomingPromotionalOffers?.length > 0;

            // Only filter by upcoming offers, not by title/slug
            // Mystery games might have different titles before reveal
            if (!hasUpcoming) return false;

            // Check if it's a free game (price should be 0 or discounted to 0)
            const upcomingOffer = game.promotions.upcomingPromotionalOffers[0].promotionalOffers[0];
            const discountPercentage = upcomingOffer?.discountSetting?.discountPercentage;

            // Check for locked/mystery game indicators
            const isLockedTitle = game.title?.toLowerCase().includes("locked");
            const isMysteryTitle = game.title?.toLowerCase().includes("mystery");
            const isLockedSlug = game.productSlug?.includes("locked") ||
                game.urlSlug?.includes("locked");
            const isMysterySlug = game.productSlug?.includes("mystery") ||
                game.urlSlug?.includes("mystery");
            const isFreePromotion = game.productSlug === "free-game-promotion" ||
                game.urlSlug === "free-game-promotion";
            const hasVaultImage = game.keyImages?.some(i => i.type === 'VaultClosed' || i.type === 'VaultOpen');
            const isFreeDiscount = discountPercentage === 0 || discountPercentage === 100;

            // Return true if it matches any locked/mystery pattern
            return isLockedTitle || isMysteryTitle || isLockedSlug || isMysterySlug ||
                isFreePromotion || (hasVaultImage && isFreeDiscount);
        }).map(game => {
            // Extract the upcoming offer details
            const upcomingOffer = game.promotions.upcomingPromotionalOffers[0].promotionalOffers[0];

            // Parse and format dates properly
            const unlockDate = new Date(upcomingOffer.startDate);
            const expiryDate = new Date(upcomingOffer.endDate);

            // Calculate time until unlock
            const now = new Date();
            const timeUntilUnlock = unlockDate - now;
            const hoursUntilUnlock = Math.floor(timeUntilUnlock / (1000 * 60 * 60));
            const daysUntilUnlock = Math.floor(hoursUntilUnlock / 24);

            // Determine if it's truly a locked/mystery game (title not revealed yet)
            const isMystery = game.title?.toLowerCase().includes("locked") ||
                game.title?.toLowerCase().includes("mystery") ||
                game.keyImages?.some(i => i.type === 'VaultClosed');

            return {
                title: isMystery ? "Mystery Game" : game.title,
                actualTitle: game.title, // Keep original title for debugging
                isMystery: isMystery,
                description: game.description,
                productSlug: game.productSlug,
                images: {
                    vault: game.keyImages?.find(i => i.type === 'VaultClosed')?.url ||
                        game.keyImages?.find(i => i.type === 'VaultOpen')?.url,
                    wide: game.keyImages?.find(i => i.type === 'OfferImageWide')?.url ||
                        game.keyImages?.find(i => i.type === 'DieselStoreFrontWide')?.url,
                    thumbnail: game.keyImages?.find(i => i.type === 'Thumbnail')?.url,
                    tall: game.keyImages?.find(i => i.type === 'OfferImageTall')?.url
                },
                unlockDate: unlockDate.toISOString(),
                expiryDate: expiryDate.toISOString(),
                unlockTimestamp: unlockDate.getTime(),
                expiryTimestamp: expiryDate.getTime(),
                timeUntilUnlock: {
                    milliseconds: timeUntilUnlock,
                    hours: hoursUntilUnlock,
                    days: daysUntilUnlock,
                    humanReadable: timeUntilUnlock > 0
                        ? `${daysUntilUnlock}d ${hoursUntilUnlock % 24}h`
                        : "Available now"
                },
                status: timeUntilUnlock > 0 ? "UPCOMING" : "AVAILABLE"
            };
        });

        console.log(`Mystery games found: ${mysteryGames.length}`);
        return mysteryGames;
    } catch (error) {
        console.error("Error fetching mystery games:", error.message);
        throw error;
    }
};

export default getMysteryGames;