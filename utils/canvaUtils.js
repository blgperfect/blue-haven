const { createCanvas, loadImage } = require('canvas');
const { format, eachDayOfInterval, eachWeekOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } = require('date-fns');
const { fr, enUS, enCA } = require('date-fns/locale');

/**
 * Génère une image de calendrier pour les événements.
 * @param {Array} events - Liste des événements.
 * @param {Date} startDate - Date de début de la période.
 * @param {String} viewType - Type de vue : 'day', 'week', 'month'.
 * @param {Object} locale - Locale pour les formats de date.
 * @returns {Buffer} - Buffer de l'image générée.
 */
async function generateCalendarImage(events, startDate, viewType, locale) {
    const canvas = createCanvas(800, 600); // Taille de l'image
    const ctx = canvas.getContext('2d');

    // Fond blanc
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Titre et sous-titre
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('📅 Calendrier des événements', 20, 40);
    ctx.font = '16px Arial';
    ctx.fillText(`Vue : ${viewType} | Fuseau horaire : ${locale.code.toUpperCase()}`, 20, 70);

    // Calcul des dates
    let days;
    if (viewType === 'day') {
        days = [startDate];
    } else if (viewType === 'week') {
        days = eachDayOfInterval({ start: startOfWeek(startDate), end: endOfWeek(startDate) });
    } else if (viewType === 'month') {
        days = eachDayOfInterval({ start: startOfMonth(startDate), end: endOfMonth(startDate) });
    }

    // Configuration de la grille
    const cellWidth = 100;
    const cellHeight = 60;
    const gridX = 20;
    const gridY = 100;

    // Dessine la grille
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    days.forEach((day, index) => {
        const x = gridX + (index % 7) * cellWidth;
        const y = gridY + Math.floor(index / 7) * cellHeight;

        // Bordures
        ctx.strokeStyle = '#CCCCCC';
        ctx.strokeRect(x, y, cellWidth, cellHeight);

        // Date
        ctx.fillText(format(day, 'dd/MM', { locale }), x + 5, y + 20);

        // Événements pour cette journée
        const dayEvents = events.filter(event => format(event.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
        dayEvents.forEach((event, i) => {
            if (i < 2) {
                ctx.fillText(`- ${event.name}`, x + 5, y + 35 + i * 15);
            }
        });

        // Indicateur "plus"
        if (dayEvents.length > 2) {
            ctx.fillText(`+${dayEvents.length - 2} événements`, x + 5, y + 50);
        }
    });

    // Retourne l'image générée
    return canvas.toBuffer();
}

module.exports = { generateCalendarImage };
