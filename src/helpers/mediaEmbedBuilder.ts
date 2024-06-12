import { Interaction } from 'discord.js';
import { overseerrApi } from './apis/overseerr/overseerrApi';
import { EmbedColors } from '../constants/notificationData';

export async function mediaEmbedBuilder(interaction: Interaction): Promise<any> {
    if (!interaction.isStringSelectMenu()) return;
    const mediaType = interaction.values[0].split('-')[1].trim();
    const mediaId = interaction.values[0].split('-')[0].trim();

    const mediaInfo = (await overseerrApi(`/${mediaType}/${mediaId}`, 'get')).data;
    mediaInfo.name = `
    ${mediaInfo.title} (${mediaType === 'tv'
    ? mediaInfo.firstAirDate?.split('-')[0]
    : mediaInfo.releaseDate?.split('-')[0]})
    `;

    // TODO: Add Logic to list seasons here
    const mediaEmbed = {
        title: mediaInfo.name,

        url: `${process.env.OVERSEERR_URL}/${mediaType}/${mediaInfo.id}`,
        color: EmbedColors.GREEN,
        fields: [
            {
                name: 'Description',
                value: mediaInfo.overview,
            },
            {
                name: 'Media ID',
                value: mediaInfo.id,
                inline: true,
            },
            {
                name: mediaType === 'tv' ? 'First Air Date' : 'Release Date',
                value: mediaType === 'tv' ? mediaInfo.firstAirDate : mediaInfo.releaseDate,
                inline: true,
            },
        ],
        thumbnail: {
            url: `https://image.tmdb.org/t/p/w500${mediaInfo.posterPath}`,
        },
    };
    return mediaEmbed;
}
