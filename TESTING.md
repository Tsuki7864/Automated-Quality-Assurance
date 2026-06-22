# Project Testing Guide

## 1. Test Strategy
This project uses **Jest** as its primary testing framework for JavaScript and Node.js. Jest was selected because it requires zero configuration for basic setups, provides an isolated environment for test execution, and includes built-in mocking utilities which are essential for testing external API integrations.

---

## 2. Manual Test Table
The following visual, interactive, and client-side storage features cannot be easily automated and must be verified manually:

| Test ID | Feature Under Test | Manual Step-by-Step Instructions | Expected Result |
| :--- | :--- | :--- | :--- |
| **MT-01** | UI Dynamic Rendering | 1. Open the search page.<br>2. Search for a title.<br>3. Verify the layout of the results grid. | Cover art, titles, and score badges must align perfectly without overlapping text. |
| **MT-02** | Browser LocalStorage | 1. Add an anime to the custom watch list.<br>2. Refresh the browser tab entirely.<br>3. Check the watch list section. | The added anime must persist on the page, showing data successfully reloaded from localStorage. |
| **MT-03** | Smooth UI Loading State | 1. Trigger a large search query.<br>2. Watch the container before data populates. | A loading spinner or skeleton text must appear smoothly and disappear instantly when data loads. |

---

## 3. Automated Test Suite

* **API Data Parsing:** Verifies that raw JSON received from the MyAnimeList API are successfully filtered and mapped into our application's internal data.
* **Cache TTL Validation:** Ensures that the system accurately recognizes when cached data has expired, preventing outdated information from serving.
* **Rate-Limit Error Interception:** Confirms that the application catches a 429 (Too Many Requests) or network error rather than crashing the backend server.