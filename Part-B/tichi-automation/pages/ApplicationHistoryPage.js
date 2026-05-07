/**
 * Application History Page - Page Object Model
 * Contains selectors and methods for the Application History page
 */

class ApplicationHistoryPage {
  constructor(page) {
    this.page = page;

    // Page URL - Updated to use My Requests tab where applications are tracked
    this.url = '/profile?tabid=requests';

    // Page elements - Updated for Tichi's actual UI
    this.pageTitle = 'h1:has-text("My Requests"), h2:has-text("Requests"), text=My Requests';
    this.historyTab = 'text=My Requests, a:has-text("My Requests"), button:has-text("My Requests")';

    // Application list elements - Updated for Tichi (using valid CSS selectors)
    this.applicationCards = '[class*="rounded"][class*="shadow"], [class*="card"]';
    this.applicationJobTitle = 'h3, h4';
    this.applicationCompany = '[class*="company"]';
    this.applicationDate = '[class*="date"]';
    this.applicationStatus = '[class*="status"]';

    // Status badges
    this.statusApplied = ':has-text("Applied"), [class*="status-applied"]';
    this.statusUnderReview = ':has-text("Under Review"), [class*="status-review"]';
    this.statusShortlisted = ':has-text("Shortlisted"), [class*="status-shortlisted"]';
    this.statusRejected = ':has-text("Rejected"), [class*="status-rejected"]';
    this.statusHired = ':has-text("Hired"), [class*="status-hired"]';

    // Filter elements
    this.statusFilter = 'select[name="status"], [data-testid="status-filter"]';
    this.dateFilter = 'select[name="date"], [data-testid="date-filter"]';
    this.clearFiltersButton = 'button:has-text("Clear"), [data-testid="clear-filters"]';

    // Sort elements
    this.sortDropdown = 'select[name="sort"], [data-testid="sort-dropdown"]';

    // Action buttons
    this.viewJobButton = 'button:has-text("View Job"), a:has-text("View Job")';
    this.withdrawButton = 'button:has-text("Withdraw"), [data-testid="withdraw-button"]';
    this.messageButton = 'button:has-text("Message"), [data-testid="message-button"]';

    // Withdrawal confirmation
    this.withdrawModal = '[class*="modal"]:has-text("Withdraw"), [data-testid="withdraw-modal"]';
    this.confirmWithdrawButton = 'button:has-text("Confirm"), button:has-text("Yes, Withdraw")';
    this.cancelWithdrawButton = 'button:has-text("Cancel"), button:has-text("No")';
    this.withdrawSuccess = ':has-text("Withdrawn"), :has-text("Application withdrawn")';

    // Empty state - Updated for Tichi
    this.emptyState = 'text=No requests, text=No posts found, text=No applications, :has-text("haven\'t applied")';
    this.startSearchButton = 'button:has-text("Find Jobs"), a:has-text("Browse Jobs"), a:has-text("Home")';

    // Loading state
    this.loadingSpinner = '[class*="loading"], [class*="spinner"]';

    // Pagination
    this.loadMoreButton = 'button:has-text("Load More"), [data-testid="load-more"]';
    this.paginationInfo = '[class*="pagination-info"], :has-text("Showing")';
  }

  /**
   * Navigate to application history/requests page
   */
  async navigate() {
    // First try direct URL
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');

    // If not on requests page, click My Requests in sidebar
    const myRequestsLink = this.page.locator('text=My Requests').first();
    if (await myRequestsLink.isVisible().catch(() => false)) {
      await myRequestsLink.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Click on My Requests tab (if on profile page)
   */
  async clickHistoryTab() {
    const tabs = [
      'text=My Requests',
      'a:has-text("My Requests")',
      'button:has-text("My Requests")'
    ];

    for (const tab of tabs) {
      const element = this.page.locator(tab).first();
      if (await element.isVisible().catch(() => false)) {
        await element.click();
        await this.page.waitForLoadState('networkidle');
        return;
      }
    }
  }

  /**
   * Get count of applications
   * @returns {number} Number of application cards
   */
  async getApplicationCount() {
    await this.waitForPageLoad();

    // Try multiple selectors to find application items
    const selectors = [
      'div:has(text=Requested)',
      'div:has(text=Pending)',
      '[class*="rounded"][class*="shadow"]',
      '[class*="card"]'
    ];

    for (const selector of selectors) {
      const count = await this.page.locator(selector).count().catch(() => 0);
      if (count > 0) {
        return count;
      }
    }

    return 0;
  }

  /**
   * Get all application job titles
   * @returns {string[]} Array of job titles
   */
  async getApplicationTitles() {
    // Try to get titles from h3/h4 elements on the page
    try {
      const titles = await this.page.locator('h3, h4').allTextContents();
      return titles.map(t => t.trim()).filter(t => t.length > 0);
    } catch {
      return [];
    }
  }

  /**
   * Get all application statuses
   * @returns {string[]} Array of statuses
   */
  async getApplicationStatuses() {
    const statuses = await this.page.locator(`${this.applicationCards} ${this.applicationStatus}`).allTextContents();
    return statuses.map(s => s.trim());
  }

  /**
   * Check if application exists by job title
   * @param {string} jobTitle - Job title to search for
   * @returns {boolean} True if application exists
   */
  async hasApplication(jobTitle) {
    const titles = await this.getApplicationTitles();
    return titles.some(title => title.toLowerCase().includes(jobTitle.toLowerCase()));
  }

  /**
   * Get application status by job title
   * @param {string} jobTitle - Job title to search for
   * @returns {string|null} Status text or null if not found
   */
  async getApplicationStatus(jobTitle) {
    const card = this.page.locator(this.applicationCards).filter({ hasText: jobTitle }).first();
    if (await card.isVisible()) {
      const status = card.locator(this.applicationStatus);
      return await status.textContent();
    }
    return null;
  }

  /**
   * Filter applications by status
   * @param {string} status - Status to filter (Applied, Under Review, etc.)
   */
  async filterByStatus(status) {
    await this.page.click(this.statusFilter);
    await this.page.click(`option[value="${status}"], li:has-text("${status}")`);
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
   * Click View Job for an application
   * @param {string} jobTitle - Job title
   */
  async viewJob(jobTitle) {
    const card = this.page.locator(this.applicationCards).filter({ hasText: jobTitle }).first();
    await card.locator(this.viewJobButton).click();
    await this.page.waitForURL(/\/job\?jobId=/);
  }

  /**
   * Withdraw an application
   * @param {string} jobTitle - Job title to withdraw
   */
  async withdrawApplication(jobTitle) {
    const card = this.page.locator(this.applicationCards).filter({ hasText: jobTitle }).first();
    await card.locator(this.withdrawButton).click();

    // Handle confirmation modal
    const modal = this.page.locator(this.withdrawModal);
    if (await modal.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.page.click(this.confirmWithdrawButton);
    }

    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if empty state is displayed
   * @returns {boolean} True if no applications
   */
  async isEmptyState() {
    const emptyIndicators = [
      'text=No requests',
      'text=No posts found',
      'text=No applications',
      'text=No data',
      'text=empty'
    ];

    for (const indicator of emptyIndicators) {
      if (await this.page.locator(indicator).isVisible().catch(() => false)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Click Find Jobs button from empty state
   */
  async clickFindJobs() {
    await this.page.click(this.startSearchButton);
    await this.page.waitForURL(/\/jobs/);
  }

  /**
   * Load more applications
   */
  async loadMore() {
    const loadMoreBtn = this.page.locator(this.loadMoreButton);
    if (await loadMoreBtn.isVisible()) {
      await loadMoreBtn.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Sort applications
   * @param {string} sortBy - Sort criteria
   */
  async sortBy(sortBy) {
    await this.page.click(this.sortDropdown);
    await this.page.click(`option[value="${sortBy}"], li:has-text("${sortBy}")`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get application details by index
   * @param {number} index - Zero-based index
   * @returns {Object} Application details
   */
  async getApplicationByIndex(index) {
    const card = this.page.locator(this.applicationCards).nth(index);

    return {
      title: await card.locator(this.applicationJobTitle).textContent().catch(() => null),
      company: await card.locator(this.applicationCompany).textContent().catch(() => null),
      date: await card.locator(this.applicationDate).textContent().catch(() => null),
      status: await card.locator(this.applicationStatus).textContent().catch(() => null)
    };
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad() {
    await this.page.waitForSelector(this.loadingSpinner, { state: 'hidden' }).catch(() => {});
    // Wait for either applications or empty state
    await Promise.race([
      this.page.waitForSelector(this.applicationCards, { timeout: 10000 }),
      this.page.waitForSelector(this.emptyState, { timeout: 10000 })
    ]).catch(() => {});
  }

  /**
   * Get count of applications by status
   * @param {string} status - Status to count
   * @returns {number} Count of applications with status
   */
  async getCountByStatus(status) {
    const statusSelector = this.page.locator(this.applicationCards).filter({
      has: this.page.locator(`:has-text("${status}")`)
    });
    return await statusSelector.count();
  }
}

module.exports = ApplicationHistoryPage;
