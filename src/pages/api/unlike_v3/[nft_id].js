import handler from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler().post(async ({ user, query: { nft_id } }, res) => {
	if (!user) return res.status(401).json({ error: 'Unauthenticated.' })

	await backend.post(
		`/v3/unlike/${nft_id}`,
		{},
		{
			headers: {
				'X-Authenticated-User': user.publicAddress,
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
			},
		}
	)

	res.status(200).end()
})
