/**
 * Jobs Page - Page Object Model
 * Contains selectors and methods for the Jobs listing page
 */

const testData = require('../utils/testData');
const { loginUser } = require('../utils/helpers');

class JobsPage {
  constructor(page) {
    this.page = page;

    // Page URL
    this.url = '/jobs';

    // Search elements
    this.searchInput = 'input[type="search"], input[placeholder*="search" i], input[name="search"], [data-testid="job-search"]';
    this.searchButton = 'button[type="submit"]:near(input[type="search"]), button:has-text("Search"), [data-testid="search-button"]';
    this.clearSearchButton = 'button[aria-label="clear"], [data-testid="clear-search"]';

    // Filter elements
    this.locationFilter = 'select[name="location"], [data-testid="location-filter"], button:has-text("Location")';
    this.locationOption = (location) => `[data-value="${location}"], option[value="${location}"], li:has-text("${location}")`;
    this.salaryFilter = '[data-testid="salary-filter"], input[name*="salary"]';
    this.jobTypeFilter = 'select[name="jobType"], [data-testid="job-type-filter"]';
    this.remoteFilter = 'input[type="checkbox"][name*="remote"], label:has-text("Remote")';
    this.clearFiltersButton = 'button:has-text("Clear"), button:has-text("Reset Filters"), [data-testid="clear-filters"]';
    this.activeFilterChips = '[class*="chip"], [class*="tag"], [data-testid="active-filter"]';

    // Job listing elements - Updated to match Tichi's actual UI
    // Job cards are div elements containing job info with FullTime badge, location, salary
    this.jobCards = '[class*="rounded"][class*="shadow"], [class*="card"], div:has(span:text("FullTime")):has(span:text("₹"))';
    this.jobTitle = 'h3, h4, [class*="font-semibold"], [class*="font-bold"]:not(button)';
    this.jobCompany = '[class*="company"], [data-testid="company-name"], span:has-text("Others")';
    this.jobLocation = 'span:has-text("Chennai"), span:has-text("Tamil Nadu"), span:has-text("Mumbai"), span:has-text("India"), [class*="location"]';
    this.jobSalary = 'span:has-text("₹"), [class*="salary"]';
    this.jobType = 'span:has-text("FullTime"), span:has-text("PartTime"), span:has-text("Contract")';

    // Pagination
    this.loadMoreButton = 'button:has-text("Load More"), button:has-text("Show More"), [data-testid="load-more"]';
    this.paginationNext = '[aria-label="Next page"], button:has-text("Next")';
    this.paginationPrev = '[aria-label="Previous page"], button:has-text("Previous")';

    // Empty state - Updated to match Tichi's actual UI
    this.noResultsMessage = 'text=No data found, text=No jobs found, text=No results, text=No posts found';
    this.emptyStateImage = '[class*="empty-state"] img, [data-testid="empty-state"]';

    // Location selector in header
    this.locationSelector = 'text=Coimbatore, text=Tamil Nadu, text=India, [class*="location"]';
    this.locationDropdown = 'button:has-text("Coimbatore"), div:has-text("Coimbatore"):near(svg)';

    // Loading state
    this.loadingSpinner = '[class*="loading"], [class*="spinner"], [data-testid="loading"]';

    // Sort options
    this.sortDropdown = 'select[name="sort"], [data-testid="sort-dropdown"]';
    this.sortByNewest = 'option[value="newest"], li:has-text("Newest")';
    this.sortBySalary = 'option[value="salary"], li:has-text("Salary")';
  }

  /**
   * Navigate to jobs page
   * Handles authentication if required (app redirects to login)
   */
  async navigate() {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');

    // Check if redirected to login page - if so, login first
    let currentUrl = this.page.url();
    if (currentUrl.includes('home') || currentUrl.includes('login') || currentUrl.includes('auth')) {
      // App requires authentication - login with test user
      await loginUser(this.page, testData.validUser.email, testData.validUser.password);

      // Check if we're still on auth pages (login may have failed or need verification)
      currentUrl = this.page.url();
      if (!currentUrl.includes('home') && !currentUrl.includes('login') && !currentUrl.includes('auth')) {
        // Successfully logged in - navigate to jobs
        await this.page.goto(this.url);
        await this.page.waitForLoadState('networkidle');
      } else {
        // Still on auth page - try navigating anyway (might work for some scenarios)
        await this.page.goto(this.url);
        await this.page.waitForLoadState('networkidle');
      }
    }
  }

  /**
   * Search for jobs by keyword
   * @param {string} keyword - Search keyword
   */
  async searchJobs(keyword) {
    await this.page.fill(this.searchInput, keyword);
    // Try clicking search button, or press Enter
    const searchBtn = this.page.locator(this.searchButton);
    if (await searchBtn.isVisible()) {
      await searchBtn.click();
    } else {
      await this.page.press(this.searchInput, 'Enter');
    }
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Clear search input
   */
  async clearSearch() {
    const clearBtn = this.page.locator(this.clearSearchButton);
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
    } else {
      await this.page.fill(this.searchInput, '');
      await this.page.press(this.searchInput, 'Enter');
    }
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Filter jobs by location
   * @param {string} location - Location to filter
   */
  async filterByLocation(location) {
    const locationBtn = this.page.locator(this.locationFilter);
    await locationBtn.click();
    await this.page.waitForTimeout(500);

    const option = this.page.locator(this.locationOption(location));
    await option.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Toggle remote work filter
   */
  async toggleRemoteFilter() {
    await this.page.click(this.remoteFilter);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Clear all filters
   */
  async clearFilters() {
    const clearBtn = this.page.locator(this.clearFiltersButton);
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Check if empty state is displayed
   * @returns {boolean} True if no data message is shown
   */
  async isEmptyState() {
    const emptyMessages = ['No data found', 'No jobs found', 'No results', 'No posts found'];
    for (const msg of emptyMessages) {
      const isVisible = await this.page.locator(`text=${msg}`).isVisible().catch(() => false);
      if (isVisible) return true;
    }
    return false;
  }

  /**
   * Get count of job cards displayed
   * @returns {number} Number of job cards
   */
  async getJobCount() {
    // First check if empty state is shown
    if (await this.isEmptyState()) {
      return 0;
    }

    // Try multiple selectors to find job cards
    const selectors = [
      'a[href*="/job?"]',
      'div[class*="rounded"][class*="shadow"]:has(a[href*="/job"])',
      '[class*="card"]:has(a[href*="/job"])',
      'div:has(span:text("FullTime"))',
      'div:has(span:text("₹"))',
      'div:has(span:text("Per Hour"))',
      'div:has(span:text("Per Week"))'
    ];

    for (const selector of selectors) {
      try {
        const count = await this.page.locator(selector).count();
        if (count > 0) {
          // Store the working selector for later use
          this.workingJobCardSelector = selector;
          return count;
        }
      } catch {
        continue;
      }
    }

    // Fallback: count elements that look like job listings
    const jobListItems = await this.page.locator('text=FullTime').count();
    return jobListItems;
  }

  /**
   * Get all job titles from listing
   * @returns {string[]} Array of job titles
   */
  async getJobTitles() {
    const titles = await this.page.locator(`${this.jobCards} ${this.jobTitle}`).allTextContents();
    return titles.map(t => t.trim());
  }

  /**
   * Get all job locations from listing
   * @returns {string[]} Array of locations
   */
  async getJobLocations() {
    const locations = await this.page.locator(`${this.jobCards} ${this.jobLocation}`).allTextContents();
    return locations.map(l => l.trim());
  }

  /**
   * Click on first job card
   */
  async clickFirstJob() {
    // Use the working selector if we found one, otherwise try multiple options
    const clickSelectors = [
      this.workingJobCardSelector,
      'a[href*="/job?"]',
      'div:has(span:text("FullTime"))',
      'div:has(span:text("₹"))',
      '[class*="rounded"][class*="shadow"]'
    ].filter(Boolean);

    for (const selector of clickSelectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible()) {
          await element.click();
          await this.page.waitForURL(/\/job\?/, { timeout: 10000 });
          return;
        }
      } catch {
        continue;
      }
    }

    // Fallback: click on any job title text
    const jobTitles = this.page.locator('h3, h4, [class*="font-semibold"]').first();
    await jobTitles.click();
    await this.page.waitForURL(/\/job\?/, { timeout: 10000 });
  }

  /**
   * Click on job card by index
   * @param {number} index - Zero-based index
   */
  async clickJobByIndex(index) {
    await this.page.waitForSelector(this.jobCards);
    await this.page.locator(this.jobCards).nth(index).click();
    await this.page.waitForURL(/\/job\?jobId=/);
  }

  /**
   * Click on job card by title
   * @param {string} title - Job title to click
   */
  async clickJobByTitle(title) {
    const jobCard = this.page.locator(this.jobCards).filter({ hasText: title }).first();
    await jobCard.click();
    await this.page.waitForURL(/\/job\?jobId=/);
  }

  /**
   * Check if no results message is displayed
   * @returns {boolean} True if no results shown
   */
  async isNoResultsDisplayed() {
    return await this.isEmptyState();
  }

  /**
   * Load more jobs (pagination)
   */
  async loadMoreJobs() {
    const loadMoreBtn = this.page.locator(this.loadMoreButton);
    if (await loadMoreBtn.isVisible()) {
      const initialCount = await this.getJobCount();
      await loadMoreBtn.click();
      await this.page.waitForLoadState('networkidle');
      // Wait for more jobs to appear
      await this.page.waitForFunction(
        (selector, count) => document.querySelectorAll(selector).length > count,
        this.jobCards,
        initialCount
      ).catch(() => {});
    }
  }

  /**
   * Sort jobs by criteria
   * @param {string} sortBy - Sort criteria (newest, salary, etc.)
   */
  async sortBy(sortBy) {
    await this.page.click(this.sortDropdown);
    await this.page.click(`option[value="${sortBy}"], li:has-text("${sortBy}")`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get active filter count
   * @returns {number} Number of active filters
   */
  async getActiveFilterCount() {
    return await this.page.locator(this.activeFilterChips).count();
  }

  /**
   * Wait for jobs to load (or empty state to appear)
   */
  async waitForJobsLoaded() {
    // Wait for loading to disappear
    await this.page.waitForSelector(this.loadingSpinner, { state: 'hidden' }).catch(() => {});

    // Wait for page content indicators - either jobs or empty state
    const contentIndicators = [
      'text=No data found',
      'text=No posts found',
      'text=FullTime',
      'text=Full Time',
      'text=₹',
      'text=Per Hour',
      'text=Per Week',
      'text=No jobs',
      'text=No results',
      'text=All Posts',
      'a[href*="/job?"]'
    ];

    for (const indicator of contentIndicators) {
      try {
        await this.page.waitForSelector(indicator, { timeout: 5000 });
        await this.page.waitForTimeout(500); // Small delay for content to settle
        return;
      } catch {
        continue;
      }
    }
  }
}

module.exports = JobsPage;
