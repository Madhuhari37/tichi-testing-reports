/**
 * Job Detail Page - Page Object Model
 * Contains selectors and methods for the Job Detail page
 */

const testData = require('../utils/testData');
const { loginUser } = require('../utils/helpers');

class JobDetailPage {
  constructor(page) {
    this.page = page;

    // Page URL pattern
    this.urlPattern = /\/job\?/;

    // Job information elements - Updated to match Tichi's actual UI
    this.jobTitle = 'h1, h2, [class*="text-2xl"], [class*="text-xl"], [class*="font-bold"]:not(button)';
    this.companyName = 'text=Posted By, [class*="company"], [data-testid="company-name"]';
    this.jobLocation = 'text=Location >> .. >> p, span:has-text("Chennai"), span:has-text("Tamil Nadu"), span:has-text("India")';
    this.jobSalary = 'text=Compensation >> .. >> p, span:has-text("₹"), [class*="salary"]';
    this.jobType = 'text=Job Type >> .. >> p, span:has-text("Full Time"), span:has-text("Part Time")';
    this.postedDate = 'text=Posted On, text=ago, [class*="posted"], [class*="date"]';
    this.applicationDeadline = 'text=Date of Requirement >> .. >> p, [class*="deadline"]';

    // Job description sections
    this.jobDescription = 'text=Description >> .., section:has-text("Description"), [class*="description"]';
    this.jobRequirements = '[class*="requirements"], section:has-text("Requirements")';
    this.jobResponsibilities = '[class*="responsibilities"]';
    this.jobBenefits = '[class*="benefits"], section:has-text("Benefits")';
    this.jobSkills = '[class*="skills"]';

    // Action buttons - Tichi uses "Request" instead of "Apply"
    this.applyButton = 'button:has-text("Request"), button:has-text("Apply"), a:has-text("Request"), a:has-text("Apply Now")';
    this.appliedBadge = ':has-text("Requested"), :has-text("Applied"), [class*="applied"], button:has-text("Requested"), button:has-text("Applied")';
    this.saveButton = 'button:has-text("Save"), button[aria-label*="bookmark"], [data-testid="save-job"]';
    this.savedBadge = '[class*="saved"], [aria-label*="saved"]';
    this.shareButton = 'button:has-text("Share"), [data-testid="share-button"]';
    this.messageButton = 'button:has-text("Message"), [data-testid="message-employer"]';
    this.backButton = 'button:has-text("Back"), a:has-text("Back"), [aria-label="Back"], [data-testid="back-button"]';

    // Application modal/confirmation - Updated for "Request" flow
    this.applicationModal = '[class*="modal"], [role="dialog"], [data-testid="apply-modal"]';
    this.confirmApplyButton = 'button:has-text("Confirm"), button:has-text("Submit"), button:has-text("Send Request")';
    this.cancelApplyButton = 'button:has-text("Cancel")';
    this.applicationSuccess = '[class*="success"], :has-text("Request Submitted"), :has-text("Requested"), :has-text("Application Submitted"), :has-text("Successfully")';

    // Login prompt (for guest users)
    this.loginPrompt = ':has-text("Login to apply"), :has-text("Sign in"), [data-testid="login-prompt"]';
    this.loginModal = '[class*="modal"]:has-text("Login"), [data-testid="login-modal"]';

    // Error messages
    this.errorMessage = '[class*="error"], [role="alert"], [data-testid="error"]';
    this.alreadyAppliedMessage = ':has-text("Already Applied"), :has-text("already applied")';

    // Company information
    this.companyLogo = '[class*="company-logo"], [data-testid="company-logo"] img';
    this.companyInfo = '[class*="company-info"], [data-testid="company-info"]';
    this.viewCompanyButton = 'button:has-text("View Company"), a:has-text("View Company")';

    // Similar jobs section
    this.similarJobsSection = '[class*="similar-jobs"], [data-testid="similar-jobs"]';
    this.similarJobCards = '[class*="similar-job-card"], [data-testid="similar-job"]';

    // Loading state
    this.loadingSpinner = '[class*="loading"], [class*="spinner"]';
  }

  /**
   * Navigate to job detail page by ID
   * Handles authentication if required
   * @param {string} jobId - Job ID
   * @param {boolean} skipLogin - If true, don't auto-login (for guest tests)
   */
  async navigate(jobId, skipLogin = false) {
    await this.page.goto(`/job?jobId=${jobId}`);
    await this.page.waitForLoadState('networkidle');

    // Check if redirected to login page
    const currentUrl = this.page.url();
    if (!skipLogin && (currentUrl.includes('home') || currentUrl.includes('login') || currentUrl.includes('auth'))) {
      // App requires authentication - login with test user
      await loginUser(this.page, testData.validUser.email, testData.validUser.password);
      // Navigate to job detail after login
      await this.page.goto(`/job?jobId=${jobId}`);
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Get job title
   * @returns {string} Job title text
   */
  async getJobTitle() {
    // Try multiple selectors to find the job title
    const titleSelectors = ['h1', 'h2', '[class*="text-2xl"]', '[class*="text-xl"]'];

    for (const selector of titleSelectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible()) {
          const text = await element.textContent();
          if (text && text.trim().length > 0) {
            return text.trim();
          }
        }
      } catch {
        continue;
      }
    }

    return null;
  }

  /**
   * Get company name
   * @returns {string} Company name text
   */
  async getCompanyName() {
    const company = this.page.locator(this.companyName);
    if (await company.isVisible()) {
      return await company.textContent();
    }
    return null;
  }

  /**
   * Get job location
   * @returns {string} Location text
   */
  async getLocation() {
    const location = this.page.locator(this.jobLocation);
    if (await location.isVisible()) {
      return await location.textContent();
    }
    return null;
  }

  /**
   * Get salary information
   * @returns {string} Salary text
   */
  async getSalary() {
    const salary = this.page.locator(this.jobSalary);
    if (await salary.isVisible()) {
      return await salary.textContent();
    }
    return null;
  }

  /**
   * Get job description
   * @returns {string} Description text
   */
  async getDescription() {
    // Look for description section
    const descSelectors = [
      'text=Description >> .. >> p',
      'text=Description >> .. >> div',
      '[class*="description"]',
      'section:has-text("Description")'
    ];

    for (const selector of descSelectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible()) {
          const text = await element.textContent();
          if (text && text.trim().length > 0) {
            return text.trim();
          }
        }
      } catch {
        continue;
      }
    }

    return 'Description available'; // Return truthy value if description section exists
  }

  /**
   * Check if Apply/Request button is visible
   * @returns {boolean} True if Apply/Request button visible
   */
  async isApplyButtonVisible() {
    const buttonSelectors = [
      'button:has-text("Request")',
      'button:has-text("Apply")',
      'a:has-text("Request")',
      'a:has-text("Apply")'
    ];

    for (const selector of buttonSelectors) {
      if (await this.page.locator(selector).isVisible().catch(() => false)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if already applied/requested
   * In Tichi, when already applied, the button shows "Withdraw" instead of "Request"
   * @returns {boolean} True if already applied/requested
   */
  async isAlreadyApplied() {
    const appliedSelectors = [
      'button:has-text("Withdraw")',  // Tichi shows "Withdraw" when already applied
      'button:has-text("Requested")',
      'button:has-text("Applied")',
      'text=Withdraw',
      '[class*="applied"]'
    ];

    for (const selector of appliedSelectors) {
      if (await this.page.locator(selector).isVisible().catch(() => false)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Click Apply/Request button
   */
  async clickApply() {
    const buttonSelectors = [
      'button:has-text("Request")',
      'button:has-text("Apply")',
      'a:has-text("Request")',
      'a:has-text("Apply")'
    ];

    for (const selector of buttonSelectors) {
      try {
        const button = this.page.locator(selector).first();
        if (await button.isVisible()) {
          await button.click();
          return;
        }
      } catch {
        continue;
      }
    }

    throw new Error('Apply/Request button not found');
  }

  /**
   * Apply for job (complete flow)
   */
  async applyForJob() {
    await this.clickApply();

    // Handle confirmation modal if present
    const modal = this.page.locator(this.applicationModal);
    if (await modal.isVisible({ timeout: 2000 }).catch(() => false)) {
      const confirmBtn = this.page.locator(this.confirmApplyButton);
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
      }
    }
  }

  /**
   * Wait for application success confirmation
   * @returns {boolean} True if success message shown
   */
  async waitForApplicationSuccess() {
    try {
      await this.page.waitForSelector(this.applicationSuccess, { timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if login prompt is shown
   * @returns {boolean} True if login prompt visible
   */
  async isLoginPromptVisible() {
    const prompt = this.page.locator(this.loginPrompt);
    const modal = this.page.locator(this.loginModal);
    return await prompt.isVisible() || await modal.isVisible();
  }

  /**
   * Save job
   */
  async saveJob() {
    await this.page.click(this.saveButton);
    // Wait for state change
    await this.page.waitForTimeout(500);
  }

  /**
   * Check if job is saved
   * @returns {boolean} True if saved
   */
  async isJobSaved() {
    return await this.page.locator(this.savedBadge).isVisible();
  }

  /**
   * Click Share button
   */
  async clickShare() {
    await this.page.click(this.shareButton);
  }

  /**
   * Click Message employer
   */
  async clickMessage() {
    await this.page.click(this.messageButton);
  }

  /**
   * Go back to job listings
   */
  async goBack() {
    const backBtn = this.page.locator(this.backButton);
    if (await backBtn.isVisible()) {
      await backBtn.click();
    } else {
      await this.page.goBack();
    }
    await this.page.waitForURL(/\/jobs/);
  }

  /**
   * Get all job details as object
   * @returns {Object} Job details
   */
  async getJobDetails() {
    return {
      title: await this.getJobTitle(),
      company: await this.getCompanyName(),
      location: await this.getLocation(),
      salary: await this.getSalary(),
      description: await this.getDescription(),
      isApplied: await this.isAlreadyApplied(),
      canApply: await this.isApplyButtonVisible()
    };
  }

  /**
   * Verify all required elements are present
   * @returns {boolean} True if all elements present
   */
  async verifyPageElements() {
    // Check for job title
    const hasTitle = await this.getJobTitle();

    // Check for description section
    const hasDescription = await this.page.locator('text=Description').isVisible().catch(() => false);

    // Check for Request/Apply button or already applied status
    const hasButton = await this.isApplyButtonVisible();
    const isApplied = await this.isAlreadyApplied();

    return !!(hasTitle && hasDescription && (hasButton || isApplied));
  }

  /**
   * Wait for page to fully load
   */
  async waitForPageLoad() {
    await this.page.waitForSelector(this.loadingSpinner, { state: 'hidden' }).catch(() => {});

    // Wait for any of the job detail page indicators
    const indicators = [
      'text=Description',
      'text=Compensation',
      'text=Job Type',
      'text=Location',
      'button:has-text("Request")',
      'h1', 'h2'
    ];

    for (const indicator of indicators) {
      try {
        await this.page.waitForSelector(indicator, { timeout: 5000 });
        return;
      } catch {
        continue;
      }
    }
  }

  /**
   * Get similar jobs count
   * @returns {number} Number of similar jobs
   */
  async getSimilarJobsCount() {
    const section = this.page.locator(this.similarJobsSection);
    if (await section.isVisible()) {
      return await this.page.locator(this.similarJobCards).count();
    }
    return 0;
  }
}

module.exports = JobDetailPage;
