import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { html } from '../lib/view'
import { shell } from './shell'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'


TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

type Props = { 
  error?: string 
  displayName?: string
  handle?: string
  avatar?: string
  banner?: string
  description?: string
  followersCount?: number
  followsCount?: number
  postsCount?: number
  createdAt?: string
  postsArray?: FeedViewPost[]
}

export function profile(props: Props) {
  return shell({
    title: 'Profile page',
    content: content(props),
  })
}

function content({ 
  error, 
  banner, 
  avatar, 
  displayName, 
  handle, 
  description, 
  followersCount, 
  followsCount, 
  postsCount, 
  createdAt,
  postsArray 
}: Props) {
  const date = ts(createdAt?? new Date().toISOString())
  return html`
    <div class="container px-0">
      <div class="row">
        <img src="${banner}" class="rounded-top px-0" alt="castle">
      </div>
      <div class="row">
        <div class="col-3" style="margin-top: -12%; position: relative;">
          <img src="${avatar}" class="img-fluid rounded-circle img-thumbnail" alt="Kitten" />
        </div>
        <div class="col">
          Edit profile
        </div>
        <div class="col">
          ...
        </div>
      </div>
      <div class="row">
        <div class="col">
          ${displayName}
        </div>
        <div class="col">
          Joined: ${date}
        </div>
      </div>
      <div class="row">
        <div class="col">
          @${handle}
        </div>
      </div>
      <div class="row">
        <div class="col">
          ${followersCount} followers
        </div>
        <div class="col">
          ${followsCount} following
        </div>
        <div class="col">
          ${postsCount} posts
        </div>
      </div>
      <div class="row py-2">
        <div class="col">
          ${description}
        </div>
      </div>
    </div>
  
  ${postsArray?.map((post: FeedViewPost) => {
    console.log(post)
      return html`
      <div class="card mt-2">
        <div class="card-body">
          <div class="container">
            <div class="row align-items-start">
              <div class="col">
                <img src="${post.post.author.avatar}" class="img-fluid rounded-circle img-thumbnail" alt="Kitten" />
              </div>
              <div class="col-7">
                <h5 class="card-title">${post.post.author.displayName}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">@${post.post.author.handle}</h6>
              </div>
              <div class="col-3">
                &#183; ${timeAgo.format(new Date(post.post.indexedAt))}
              </div>
            </div>
          </div>
          <p class= "card-text"> ${(post.post.record as { text: string }).text} </p>
          <img src="..." class="card-img-top" alt="...">
        </div>
        <div class="card-footer">
          Comments | reposts & Quotes | Likes | ...
        </div>
      </div>
    `
  })}
  `
}

function ts(createdAt: string) {
  const created = new Date(createdAt)
  return created.toDateString()
}
