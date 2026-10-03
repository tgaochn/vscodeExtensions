/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { ExtensionContext } from "vscode";
import { HelpAndFeedbackView, Link, StandardLinksProvider, Command } from "vscode-ext-help-and-feedback-view";

export function registerHelpAndFeedbackView(context: ExtensionContext) {
    const items = new Array<Link | Command>();
    const predefinedProvider = new StandardLinksProvider('m0m0.m0m0-33-project-manager');
    items.push(predefinedProvider.getGetStartedLink());
    // `ProvideFeedbackLink` is not used here: its argument is a Twitter hashtag, not a URL, so it
    // produced a "Provide Feedback" entry that opened a tweet composer mentioning @code.
    items.push(predefinedProvider.getReviewIssuesLink());
    items.push(predefinedProvider.getReportIssueLink());
    new HelpAndFeedbackView(context, "projectManagerHelpAndFeedback", items);
}