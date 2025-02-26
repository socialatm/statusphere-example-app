import express from "express";
import type { AppContext } from "#/index";
import { getSessionAgent, handler } from "#/lib/utils";
import { page } from "#/lib/view";
import { home } from "#/pages/home";
import { login } from "#/pages/login";

export const createProfileRouter = (ctx: AppContext) => {
	const router = express.Router();

	router.get(
		"/profile",
		handler(async (req, res) => {
			// If the user is signed in, get an agent which communicates with their server
			const agent = await getSessionAgent(req, res, ctx);
			// If the user is not logged in send them to the login page.
			if (!agent) {
				return res.type("html").send(page(login({})));
			}
			const { data } = await agent.getProfile({ actor: agent.assertDid });
			const profile = data;

			// profile page
			//https://docs.bsky.app/docs/tutorials/viewing-feeds#author-feeds
			const feed = await agent.getAuthorFeed({
				actor: agent.assertDid,
				filter: "posts_no_replies",
				limit: 50,
			});

			const { feed: postsArray, cursor: nextPage } = feed.data;
			// sort decending by createdAt
			postsArray.sort((a, b) =>
				(a.post.record as { createdAt: string }).createdAt >
				(b.post.record as { createdAt: string }).createdAt
					? -1
					: 1,
			);

			return res.type("html").send(
				page(
					home({						
						profile,
						postsArray,
					}),
				),
			);
		}),
	);

	return router;
};
