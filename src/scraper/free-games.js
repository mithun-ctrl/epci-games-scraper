import axios from "axios";
import Config from "../utils/config.js";

const getFreeGames = async () => {
    try {
        const response = await axios.get(Config.EPIC_URL);
        const elements = response.data.data.Catalog.searchStore.elements;

        const freeGames = elements.filter(game => {
            return game.promotions &&
                game.promotions.promotionalOffers.length > 0 &&
                game.price.totalPrice.discountPrice === 0;
        })
            .map(game => {
                // Extract categories for genres
                const genres = game.categories?.map(cat => cat.path).filter(Boolean) || [];

                // Extract tags for additional metadata
                const tags = game.tags?.map(tag => tag.id).filter(Boolean) || [];

                // Get custom attributes (developer, publisher, features, etc.)
                const customAttributes = game.customAttributes || {};
                const getCustomAttribute = (key) => {
                    const attr = customAttributes[key];
                    return attr?.value || null;
                };

                // Parse features from tags and custom attributes
                // const features = [];
                // if (tags.includes('1264')) features.push('Single Player');
                // if (tags.includes('1203')) features.push('Multiplayer');
                // if (tags.includes('1299')) features.push('Co-op');
                // if (tags.includes('1370')) features.push('Controller Support');
                // if (tags.includes('9547')) features.push('Cloud Saves');
                // if (customAttributes.CloudSaveFolder) features.push('Cloud Saves');

                // Get rating info
                const ratingSystem = game.offerMappings?.[0]?.pageSlug;
                const ageRating = getCustomAttribute('com.epicgames.app.releaseinfo.agerating');

                // Calculate expiry date and time remaining
                const expiryDate = new Date(game.promotions.promotionalOffers[0].promotionalOffers[0].endDate);
                const now = new Date();
                const timeRemaining = expiryDate - now;

                const MS_IN_MINUTE = 1000 * 60;
                const MS_IN_HOUR = MS_IN_MINUTE * 60;
                const MS_IN_DAY = MS_IN_HOUR * 24;

                const daysRemaining = Math.floor(timeRemaining / MS_IN_DAY);
                const hoursRemaining = Math.floor(
                    (timeRemaining % MS_IN_DAY) / MS_IN_HOUR
                );
                const minutesRemaining = Math.floor(
                    (timeRemaining % MS_IN_HOUR) / MS_IN_MINUTE
                );

                return {
                    title: game.title,
                    description: game.description,
                    // longDescription: game.longDescription || game.description,

                    // // Publisher & Developer
                    // seller: game.seller?.name,
                    // developer: getCustomAttribute('developerName') || game.developerDisplayName || game.seller?.name,
                    // publisher: getCustomAttribute('publisherName') || game.publisherDisplayName || game.seller?.name,

                    // Genres & Categories
                    // genres: genres,
                    // tags: tags,
                    categories: game.categories?.map(cat => cat.path) || [],

                    // Features
                    // features: features.length > 0 ? features : null,

                    // Rating & Reviews (Epic doesn't provide review scores in this API)
                    // ageRating: ageRating,

                    // Images
                    images: {
                        // thumbnail: game.keyImages?.find(i => i.type === 'Thumbnail')?.url,
                        portrait: game.keyImages?.find(i => i.type === 'OfferImageTall')?.url,
                        landscape: game.keyImages?.find(i => i.type === 'OfferImageWide')?.url,
                        // logo: game.keyImages?.find(i => i.type === 'Logo')?.url,
                        // featured: game.keyImages?.find(i => i.type === 'DieselStoreFrontWide')?.url
                    },

                    // Release Info
                    // releaseDate: getCustomAttribute('com.epicgames.app.releaseinfo.releaseDate') ||
                    //     game.releaseDate ||
                    //     game.effectiveDate,

                    // URLs
                    url: `https://store.epicgames.com/en-US/p/${game.catalogNs?.mappings?.[0]?.pageSlug || game.productSlug}`,
                    productSlug: game.productSlug,

                    // Pricing
                    // originalPrice: game.price?.totalPrice?.originalPrice || 0,
                    // discountPrice: game.price?.totalPrice?.discountPrice || 0,
                    currencyCode: game.price?.totalPrice?.currencyCode,

                    // Expiry Info
                    expiryDate: expiryDate.toISOString(),
                    expiryTimestamp: expiryDate.getTime(),
                    timeRemaining: {
                        milliseconds: timeRemaining,
                        days: daysRemaining,
                        hours: hoursRemaining,
                        minutes: minutesRemaining,
                        humanReadable: timeRemaining > 0
                            ? `${daysRemaining}d ${hoursRemaining}h ${minutesRemaining}m`
                            : "Expired"
                    },
                    // Additional metadata
                    namespace: game.namespace,
                    status: game.status,

                    // Debug info (can be removed in production)
                    // _debug: {
                    //     hasCustomAttributes: Object.keys(customAttributes).length > 0,
                    //     availableAttributes: Object.keys(customAttributes)
                    // }
                };
            });

        return freeGames;
    } catch (error) {
        console.error("Error fetching games from Epic:", error.message);
        return [];
    }
}

export default getFreeGames;