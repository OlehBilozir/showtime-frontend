import { useEffect, useState, useContext, useCallback, createRef } from 'react'
import { DEFAULT_PROFILE_PIC, MENTIONS_STYLE } from '@/lib/constants'
import AppContext from '@/context/app-context'
import backend from '@/lib/backend'
import mixpanel from 'mixpanel-browser'
import Comment from './Comment'
import { Mention, MentionsInput } from 'react-mentions'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { formatAddressShort } from '@/lib/utilities'
import axios from '@/lib/axios'

export default function CommentsSection({ item, closeModal, modalRef, commentCount }) {
	const context = useContext(AppContext)
	const { user } = context
	let refArray = []

	const {
		nft_id: nftId,
		owner_id: nftOwnerId,
		creator_id: nftCreatorId,
		owner_count: ownerCount,
	} = item

	const [comments, setComments] = useState()
	const [commentText, setCommentText] = useState('')
	const [parentComment, setParentComment] = useState(null)
	const [replyActive, setReplyActive] = useState(false)
	const [loadingComments, setLoadingComments] = useState(true)
	const [hasMoreComments, setHasMoreComments] = useState(false)
	const [loadingMoreComments, setLoadingMoreComments] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSearchQuery = (mentionSearchText, callback) => {
		if (!mentionSearchText) return
		return backend
			.get(`/v1/search?q=${mentionSearchText}&limit=5&nft_id=${nftId}`, {
				method: 'get',
			})
			.then(res => res?.data?.data || [])
			.then(res =>
				res.map(r => ({
					username: r.username,
					id: r.username || r.address0,
					address: r.address0,
					display: r.name || formatAddressShort(r.address0),
					img_url: r.img_url || DEFAULT_PROFILE_PIC,
				}))
			)
			.then(callback)
	}

	const handleReplyQuery = (mentionSearchText, callback) => {
		if (!mentionSearchText) return
		let matched = false
		backend
			.get(`/v1/search?q=${mentionSearchText}&limit=5&nft_id=${nftId}`, {
				method: 'get',
			})
			.then(res => res?.data?.data || [])
			.then(res =>
				res.map(r => ({
					username: r.username,
					id: r.username || r.address0,
					address: r.address0,
					display: r.name || formatAddressShort(r.address0),
					img_url: r.img_url || DEFAULT_PROFILE_PIC,
				}))
			)
			.then(res => {
				callback(res)
				res.find(r => {
					console.log(r)
					if (r.username === mentionSearchText) {
						console.log('r is true')
						matched = true
					}
				})
			})
			.then(() => {
				if (matched) {
					let list = document.querySelector('div.mentions-input ul')
					list.style.display = 'none'
					setTimeout(() => {
						let link = document.querySelector('div.mentions-input li')
						link?.click()
					}, 500)
				}
			})
	}

	const handleDebouncedSearchQuery = useCallback(
		AwesomeDebouncePromise(handleSearchQuery, 300),
		[]
	)

	const refreshComments = async () => {
		const commentsData = await backend.get(
			`/v2/comments/${nftId}${hasMoreComments ? '' : '?limit=10'}`
		)
		setComments(commentsData.data.data.comments)
		setHasMoreComments(commentsData.data.data.has_more)
		setLoadingComments(false)
	}

	const handleGetMoreComments = async () => {
		setLoadingMoreComments(true)
		await refreshComments(nftId)
		setLoadingMoreComments(false)
		setHasMoreComments(false)
	}

	const nestedReply = comment => {
		setParentComment(comment)
		setReplyActive(true)
	}

	const createComment = async () => {
		setIsSubmitting(true)
		let endpoint = '/api/createcomment'
		let payload = {
			nftId,
			message: commentText,
			parent_id: parentComment?.comment_id,
		}
		await axios
			.post(endpoint, payload)
			.then(() => {
				refreshComments(false)
				storeCommentInContext()
				parentComment ? mixpanel.track('Reply created') : mixpanel.track('Comment created')
			})
			.catch(err => {
				if (err.response.data.code === 429) {
					return context.setThrottleMessage(err.response.data.message)
				}
				console.error(err)
			})
		setCommentText('')
		setParentComment(null)
		setIsSubmitting(false)
	}

	const deleteComment = async commentId => {
		await axios.post('/api/deletecomment', { commentId })
		removeCommentFromContext()
		mixpanel.track('Comment deleted')
		await refreshComments(false)
	}

	const handleLoggedOutComment = () => {
		context.setLoginModalOpen(true)
		mixpanel.track('Commented but logged out')
	}

	const storeCommentInContext = async () => {
		const myCommentCounts = context.myCommentCounts
		const newAmountOfMyComments =
			((myCommentCounts && myCommentCounts[nftId]) || commentCount) + 1
		context.setMyCommentCounts({
			...context.myCommentCounts,
			[nftId]: newAmountOfMyComments,
		})
		if (newAmountOfMyComments === 1) {
			context.setMyComments([...context.myComments, nftId])
		}
	}

	const removeCommentFromContext = async () => {
		const myCommentCounts = context.myCommentCounts
		const newAmountOfMyComments =
			((myCommentCounts && myCommentCounts[nftId]) || commentCount) - 1
		context.setMyCommentCounts({
			...context.myCommentCounts,
			[nftId]: newAmountOfMyComments,
		})
		if (newAmountOfMyComments === 0) {
			context.setMyComments(context.myComments.filter(item => !(item === nftId)))
		}
	}

	useEffect(() => {
		setHasMoreComments(false)
		setLoadingComments(true)
		setLoadingMoreComments(false)
		refreshComments()
		return () => setComments(null)
	}, [nftId])

	useEffect(() => {
		if (parentComment && replyActive) {
			setCommentText('@' + (parentComment.username || parentComment.name))
			refArray[0]?.current?.focus()
			setReplyActive(false)
		}
	}, [refArray])

	const suggestion = s => {
		const suggestionRef = createRef()
		refArray.push(suggestionRef)
		return (
			<div className="flex items-center" ref={suggestionRef}>
				<img src={s.img_url} className="h-6 w-6 mr-2 rounded-full" />
				<span className="">{s.display}</span>
				{s.username && <span className="text-gray-400 ml-2">@{s.username}</span>}
			</div>
		)
	}

	const commentItem = (comment, type) => {
		return (
			<Comment
				key={comment.comment_id}
				comment={comment}
				modalRef={modalRef}
				closeModal={closeModal}
				deleteComment={deleteComment}
				nftOwnerId={ownerCount > 0 ? null : nftOwnerId}
				nftCreatorId={nftCreatorId}
				nestedReply={nestedReply}
				isReply={type}
			/>
		)
	}

	const inputItem = type => {
		const newInputRef = createRef()
		refArray.push(newInputRef)
		return (
			<div
				className={`${!type ? 'ml-10 ' : ''} my-2 flex items-stretch flex-col md:flex-row`}
			>
				<MentionsInput
					value={(!type && parentComment) || parentComment === null ? commentText : ''}
					inputRef={!type ? newInputRef : null}
					onChange={e => setCommentText(e.target.value)}
					onFocus={() => context.setCommentInputFocused(true)}
					onBlur={() => context.setCommentInputFocused(false)}
					disabled={context.disableComments || (type && parentComment)}
					style={MENTIONS_STYLE}
					placeholder="Your comment..."
					className="mentions-input flex-grow md:mr-2"
					allowSuggestionsAboveCursor
					allowSpaceInQuery
					maxLength={240}
				>
					<Mention
						trigger="@"
						renderSuggestion={parentComment ? () => <></> : s => suggestion(s)}
						displayTransform={(id, display) => `${display}`}
						data={parentComment ? handleReplyQuery : handleDebouncedSearchQuery}
						className="bg-purple-200 rounded -ml-1 sm:ml-0"
						appendSpaceOnAdd
					/>
				</MentionsInput>
				<button
					onClick={!user ? handleLoggedOutComment : createComment}
					disabled={
						isSubmitting ||
						!commentText ||
						commentText === '' ||
						commentText.trim() === '' ||
						context.disableComments
					}
					className="px-4 py-3 bg-black rounded-xl mt-4 md:mt-0 justify-center text-white flex items-center cursor-pointer hover:bg-stpink transition-all disabled:bg-gray-700"
				>
					{!isSubmitting ? (
						'Post'
					) : (
						<div className="inline-block w-6 h-6 border-2 border-gray-100 border-t-gray-800 rounded-full animate-spin" />
					)}
				</button>
			</div>
		)
	}

	return (
		<div className="w-full">
			<div>
				<div className="md:text-lg py-4" id="CommentsSectionScroll">
					Comments
				</div>
				{loadingComments ? (
					<div className="text-center my-4">
						<div className="inline-block border-4 w-12 h-12 rounded-full border-gray-100 border-t-gray-800 animate-spin" />
					</div>
				) : (
					<div>
						<div className="py-2 px-4 border-2 border-gray-300 rounded-xl">
							{hasMoreComments && (
								<div className="flex flex-row items-center my-2 justify-center">
									{!loadingMoreComments ? (
										<div
											className="text-center px-4 py-1 flex items-center w-max border-2 border-gray-300 rounded-full hover:text-stpink hover:border-stpink cursor-pointer transition-all"
											onClick={handleGetMoreComments}
										>
											<div className="mr-2 text-sm">
												Show Earlier Comments
											</div>
										</div>
									) : (
										<div className="p-1">
											<div className="inline-block w-6 h-6 border-2 border-gray-100 border-t-gray-800 rounded-full animate-spin" />
										</div>
									)}
								</div>
							)}
							<div className="mb-4">
								{comments.length > 0 ? (
									comments.map(comment => (
										<div key={comment.comment_id}>
											{commentItem(comment, false)}
											{parentComment?.comment_id === comment?.comment_id &&
												inputItem(false)}
											{comment.replies?.length > 0 && (
												<div className="ml-10">
													{comment.replies?.map(comment => (
														<div key={comment.comment_id}>
															{commentItem(comment, true)}
														</div>
													))}
												</div>
											)}
										</div>
									))
								) : (
									<div className="my-2 mb-3 p-3 bg-gray-100 rounded-xl">
										No comments yet.
									</div>
								)}
							</div>
							{inputItem(true)}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
