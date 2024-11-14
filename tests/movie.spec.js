// @ts-check
const { test, expect } = require("@playwright/test");

// 常量配置
const BASE_URL = "http://localhost:3000/movie-app#/";
const MINION_MOVIE_ID = "438148";

// 共用函數
async function waitForMovieCards(page) {
  await page.waitForSelector(".movie-card", { state: "visible" });
}

test.describe("基礎功能測試", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test("應用標題檢查", async ({ page }) => {
    await expect(page).toHaveTitle(/Movie App/);
  });

  test("導航到搜索頁面", async ({ page }) => {
    const searchIcon = page.locator(".bi-search");
    await expect(searchIcon).toBeVisible();
    await searchIcon.click();
    await expect(page).toHaveURL(/.*\/search/);
  });
  test("導航到首頁", async ({ page }) => {
    const homeIcon = page.locator(".navbar-brand");
    await expect(homeIcon).toBeVisible();
    await homeIcon.click();
    console.log(page.url());
    await expect(page).toHaveURL(BASE_URL);
  });
});

test.describe("電影列表頁面", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test("初始加載與排序", async ({ page }) => {
    console.log(page.url());
    await expect(page.locator("h2")).toHaveText("Discover Movies");

    const sortSelect = page.locator("select");
    await expect(sortSelect).toBeVisible();

    // 等待電影卡片載入
    await waitForMovieCards(page);
    const movieCards = await page.$$(".movie-card");
    expect(movieCards.length).toBeGreaterThan(0);

    // 測試不同排序選項
    const sortOptions = [
      "vote_average.desc&vote_count.gte=1000",
      "popularity.desc",
    ];
    for (const option of sortOptions) {
      await sortSelect.selectOption(option);
      await waitForMovieCards(page);
      const movieCards = await page.$$(".movie-card");
      expect(movieCards.length).toBeGreaterThan(0);
    }
  });

  test("分頁功能", async ({ page }) => {
    const pagination = page.locator(".pagination");
    await expect(pagination).toBeVisible();

    // 優化分頁測試
    const pageActions = [
      { action: "Next", expectedPage: "2" },
      { action: "Prev", expectedPage: "1" },
    ];

    for (const { action, expectedPage } of pageActions) {
      await page.locator(`button:text("${action}")`).click();
      await waitForMovieCards(page);
      await expect(page.locator(".pagination span").first()).toHaveText(
        expectedPage
      );
    }
  });
});

test.describe("搜索結果頁面", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}search`);
  });

  test("搜索功能與UI元素", async ({ page }) => {
    // 優化搜索測試
    const searchInput = page.locator('input[type="text"]');
    const sortSelect = page.locator("select#sort");

    await expect(searchInput).toBeVisible();
    await expect(sortSelect).toBeVisible();

    // 執行搜索
    await searchInput.fill("Marvel");
    await page.keyboard.press("Enter");
    await waitForMovieCards(page);

    // 測試排序功能
    const sortOptions = ["release_date", "popularity", "rating"];
    for (const option of sortOptions) {
      await sortSelect.selectOption(option);
      await page.waitForTimeout(500); // 考慮替換為更好的等待策略
    }
  });
});

test.describe("電影詳情頁面", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}movie/${MINION_MOVIE_ID}`);
  });

  test("頁面內容加載", async ({ page }) => {
    // 優化元素檢查
    const elements = [
      ".movie-header",
      ".movie-info",
      ".movie-poster",
      ".cast-section",
      ".reviews-section",
      ".movie-trailer",
    ];

    for (const selector of elements) {
      await expect(page.locator(selector)).toBeVisible();
    }
  });
});

test.describe("Watch List Page", () => {
  test("未登入時重定向到首頁", async ({ page }) => {
    await page.goto("http://localhost:3000/movie-app#/watchlist");

    // 驗證是否重定向到首頁
    await expect(page).toHaveURL("http://localhost:3000/movie-app#/");
  });
});
