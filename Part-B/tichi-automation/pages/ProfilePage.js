/**
 * Profile Page - Page Object Model
 * Contains selectors and methods for the User Profile page
 */

const testData = require('../utils/testData');

class ProfilePage {
  constructor(page) {
    this.page = page;

    // Page URL patterns
    this.profileUrl = '/profile';
    this.urlPattern = /\/profile/;

    // Profile navigation/tabs
    this.profileTab = 'text=Profile, a:has-text("Profile")';
    this.myRequestsTab = 'text=My Requests, a:has-text("My Requests")';
    this.myPostsTab = 'text=My Posts, a:has-text("My Posts")';
    this.historyTab = 'text=History, a:has-text("History")';
    this.reviewsTab = 'text=Reviews, a:has-text("Reviews")';

    // Profile header section
    this.profileHeader = '[class*="profile-header"], .profile-header';
    this.profileAvatar = 'img[alt*="profile"], img[alt*="avatar"], [class*="avatar"] img';
    this.profileName = 'h1, h2, [class*="name"]';
    this.profileTitle = '[class*="job-title"], [class*="title"]';
    this.editProfileButton = 'button:has-text("Edit"), a:has-text("Edit Profile"), [data-testid="edit-profile"]';

    // User information fields
    this.firstNameField = 'input[name="firstName"], input[placeholder*="First"]';
    this.lastNameField = 'input[name="lastName"], input[placeholder*="Last"]';
    this.emailField = 'input[name="email"], input[type="email"]';
    this.phoneField = 'input[name="phone"], input[name="phoneNumber"], input[placeholder*="Phone"]';
    this.jobTitleField = 'input[name="jobTitle"], input[placeholder*="Job Title"]';
    this.aboutMeField = 'textarea[name="aboutMe"], textarea[placeholder*="About"]';
    this.locationField = 'input[name="location"], input[placeholder*="Location"]';

    // Profile details display
    this.userName = 'text=Madhu, h1, h2, [class*="user-name"]';
    this.userEmail = 'text=@gmail.com, [class*="email"]';
    this.userPhone = '[class*="phone"], text=9047';
    this.userJobTitle = 'text=QA Engineer, [class*="job-title"]';
    this.userLocation = 'text=Coimbatore, text=Tamil Nadu, [class*="location"]';
    this.userAbout = '[class*="about"], text=QA';

    // Skills section
    this.skillsSection = 'text=Skills, [class*="skills"]';
    this.skillTags = '[class*="skill-tag"], [class*="chip"]';
    this.addSkillButton = 'button:has-text("Add Skill"), [data-testid="add-skill"]';

    // Experience section
    this.experienceSection = 'text=Experience, [class*="experience"]';
    this.experienceItems = '[class*="experience-item"], [class*="work-history"]';
    this.addExperienceButton = 'button:has-text("Add Experience"), [data-testid="add-experience"]';

    // Education section
    this.educationSection = 'text=Education, [class*="education"]';
    this.educationItems = '[class*="education-item"]';
    this.addEducationButton = 'button:has-text("Add Education"), [data-testid="add-education"]';

    // Documents section
    this.documentsSection = 'text=Documents, [class*="documents"]';
    this.documentItems = '[class*="document-item"]';
    this.uploadDocumentButton = 'button:has-text("Upload"), input[type="file"]';

    // Save/Cancel buttons
    this.saveButton = 'button:has-text("Save"), button:has-text("Update"), button[type="submit"]';
    this.cancelButton = 'button:has-text("Cancel")';

    // Success/Error messages
    this.successMessage = '[class*="success"], text=Successfully, text=Updated, [role="alert"]';
    this.errorMessage = '[class*="error"], [role="alert"]:has-text("Error")';

    // Loading state
    this.loadingSpinner = '[class*="loading"], [class*="spinner"]';

    // Sidebar menu items
    this.sidebarProfile = 'a:has-text("Profile"), [class*="sidebar"] text=Profile';
    this.sidebarMyRequests = 'a:has-text("My Requests"), [class*="sidebar"] text=My Requests';
    this.sidebarMyPosts = 'a:has-text("My Posts"), [class*="sidebar"] text=My Posts';
    this.sidebarHistory = 'a:has-text("History"), [class*="sidebar"] text=History';
    this.sidebarReviews = 'a:has-text("Reviews"), [class*="sidebar"] text=Reviews';
    this.sidebarSubscriptions = 'a:has-text("Subscriptions"), text=Subscriptions';
    this.sidebarSignOut = 'text=Sign Out, button:has-text("Sign Out"), a:has-text("Sign Out")';

    // Empty states
    this.noPostsMessage = 'text=No posts found, text=No posts yet';
    this.noRequestsMessage = 'text=No requests, text=No posts found';
    this.noReviewsMessage = 'text=No reviews, text=No reviews yet';
  }

  /**
   * Navigate to profile page
   */
  async navigate() {
    await this.page.goto('/profile');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
  }

  /**
   * Navigate to specific profile tab
   * @param {string} tabName - Tab name: 'profile', 'requests', 'posts', 'history', 'reviews'
   */
  async navigateToTab(tabName) {
    const tabMap = {
      'profile': 'profile',
      'requests': 'requests',
      'posts': 'posts',
      'history': 'history',
      'reviews': 'reviews'
    };

    const tabId = tabMap[tabName.toLowerCase()] || tabName;
    await this.page.goto(`/profile?tabid=${tabId}`);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
  }

  /**
   * Wait for profile page to load
   */
  async waitForPageLoad() {
    await this.page.waitForSelector(this.loadingSpinner, { state: 'hidden' }).catch(() => {});

    // Wait for profile content indicators
    const indicators = [
      'text=My Profile',
      'text=Profile',
      'text=My Requests',
      'text=My Posts'
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
   * Check if profile page is loaded
   * @returns {boolean} True if profile page is loaded
   */
  async isProfilePageLoaded() {
    const hasMyProfile = await this.page.locator('text=My Profile').isVisible().catch(() => false);
    const hasProfile = await this.page.locator('text=Profile').first().isVisible().catch(() => false);
    return hasMyProfile || hasProfile;
  }

  /**
   * Get user's display name
   * @returns {string} User's name
   */
  async getUserName() {
    const nameSelectors = ['h1', 'h2', '[class*="name"]', 'text=Madhu'];

    for (const selector of nameSelectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible()) {
          const text = await element.textContent();
          if (text && text.trim().length > 0 && !text.includes('My Profile')) {
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
   * Get user's email
   * @returns {string} User's email
   */
  async getUserEmail() {
    const emailElement = this.page.locator('text=@gmail.com, text=@').first();
    if (await emailElement.isVisible().catch(() => false)) {
      return await emailElement.textContent();
    }
    return null;
  }

  /**
   * Get user's job title
   * @returns {string} User's job title
   */
  async getJobTitle() {
    const jobTitleElement = this.page.locator('text=QA Engineer, text=Engineer, [class*="job-title"]').first();
    if (await jobTitleElement.isVisible().catch(() => false)) {
      return await jobTitleElement.textContent();
    }
    return null;
  }

  /**
   * Get user's location
   * @returns {string} User's location
   */
  async getLocation() {
    const locationElement = this.page.locator('text=Coimbatore, text=Tamil Nadu').first();
    if (await locationElement.isVisible().catch(() => false)) {
      return await locationElement.textContent();
    }
    return null;
  }

  /**
   * Click Edit Profile button
   */
  async clickEditProfile() {
    const editBtn = this.page.locator('button:has-text("Edit"), a:has-text("Edit")').first();
    if (await editBtn.isVisible().catch(() => false)) {
      await editBtn.click();
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Check if Edit Profile button is visible
   * @returns {boolean} True if edit button is visible
   */
  async isEditButtonVisible() {
    return await this.page.locator('button:has-text("Edit"), a:has-text("Edit")').first().isVisible().catch(() => false);
  }

  /**
   * Click on Profile tab in sidebar
   */
  async clickProfileTab() {
    await this.page.locator(this.sidebarProfile).first().click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  /**
   * Click on My Requests tab in sidebar
   */
  async clickMyRequestsTab() {
    await this.page.locator(this.sidebarMyRequests).first().click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  /**
   * Click on My Posts tab in sidebar
   */
  async clickMyPostsTab() {
    await this.page.locator(this.sidebarMyPosts).first().click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  /**
   * Click on History tab in sidebar
   */
  async clickHistoryTab() {
    await this.page.locator(this.sidebarHistory).first().click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  /**
   * Click on Reviews tab in sidebar
   */
  async clickReviewsTab() {
    await this.page.locator(this.sidebarReviews).first().click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  /**
   * Check if My Requests section is empty
   * @returns {boolean} True if no requests
   */
  async isRequestsEmpty() {
    return await this.page.locator('text=No posts found, text=No requests').isVisible().catch(() => false);
  }

  /**
   * Check if My Posts section is empty
   * @returns {boolean} True if no posts
   */
  async isPostsEmpty() {
    return await this.page.locator('text=No posts found, text=No posts yet').isVisible().catch(() => false);
  }

  /**
   * Check if Reviews section is empty
   * @returns {boolean} True if no reviews
   */
  async isReviewsEmpty() {
    return await this.page.locator('text=No reviews, text=No reviews yet').isVisible().catch(() => false);
  }

  /**
   * Get count of requests
   * @returns {number} Number of requests
   */
  async getRequestsCount() {
    if (await this.isRequestsEmpty()) {
      return 0;
    }
    // Count request items
    const items = await this.page.locator('[class*="card"], [class*="item"]').count();
    return items;
  }

  /**
   * Get count of posts
   * @returns {number} Number of posts
   */
  async getPostsCount() {
    if (await this.isPostsEmpty()) {
      return 0;
    }
    const items = await this.page.locator('[class*="card"], [class*="post-item"]').count();
    return items;
  }

  /**
   * Check if user avatar is visible
   * @returns {boolean} True if avatar visible
   */
  async isAvatarVisible() {
    return await this.page.locator('img[alt*="profile"], img[alt*="avatar"], [class*="avatar"]').first().isVisible().catch(() => false);
  }

  /**
   * Click Sign Out button
   */
  async clickSignOut() {
    const signOutBtn = this.page.locator('text=Sign Out').first();
    if (await signOutBtn.isVisible().catch(() => false)) {
      await signOutBtn.click();
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);
    }
  }

  /**
   * Check if Sign Out button is visible
   * @returns {boolean} True if sign out visible
   */
  async isSignOutVisible() {
    return await this.page.locator('text=Sign Out').isVisible().catch(() => false);
  }

  /**
   * Get all profile details as object
   * @returns {Object} Profile details
   */
  async getProfileDetails() {
    return {
      name: await this.getUserName(),
      email: await this.getUserEmail(),
      jobTitle: await this.getJobTitle(),
      location: await this.getLocation(),
      hasAvatar: await this.isAvatarVisible(),
      canEdit: await this.isEditButtonVisible()
    };
  }

  /**
   * Verify profile sections are visible
   * @returns {Object} Visibility of each section
   */
  async verifySectionsVisible() {
    return {
      profile: await this.page.locator('text=Profile').first().isVisible().catch(() => false),
      myRequests: await this.page.locator('text=My Requests').isVisible().catch(() => false),
      myPosts: await this.page.locator('text=My Posts').isVisible().catch(() => false),
      history: await this.page.locator('text=History').isVisible().catch(() => false),
      reviews: await this.page.locator('text=Reviews').isVisible().catch(() => false)
    };
  }

  /**
   * Check if subscriptions section is visible
   * @returns {boolean} True if subscriptions visible
   */
  async isSubscriptionsVisible() {
    return await this.page.locator('text=Subscriptions').isVisible().catch(() => false);
  }

  /**
   * Click on Subscriptions
   */
  async clickSubscriptions() {
    await this.page.locator('text=Subscriptions').click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }
}

module.exports = ProfilePage;
