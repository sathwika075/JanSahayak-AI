// c:\Nxtwave-Sathwika\jansahayak-ai\backend\nationalEligibilityEngine.js
// Advanced 3-Tier Rule-Based Deterministic Eligibility Engine
// Supports 3 Classifications: 'Eligible', 'Potentially Eligible' (missing info), 'Not Eligible' (failed criteria)

function evaluateNationalEligibility(profile = {}, scheme = {}) {
  const metCriteria = [];
  const unmetCriteria = [];
  const missingInfo = [];

  // 1. STATE & UT ELIGIBILITY
  if (scheme.state && scheme.state !== "All India (Central)") {
    if (!profile.state) {
      missingInfo.push(`State of residence not specified (Scheme requires ${scheme.state})`);
    } else if (profile.state.toLowerCase() === scheme.state.toLowerCase()) {
      metCriteria.push(`State Domicile: Matches requirement (${scheme.state})`);
    } else {
      unmetCriteria.push(`State Domicile: Requires ${scheme.state}, but citizen profile has ${profile.state}`);
    }
  } else {
    metCriteria.push("National Scope: Open to all Indian citizens across 28 States & 8 UTs");
  }

  // 2. ANNUAL FAMILY INCOME ELIGIBILITY
  if (scheme.income_limit !== null && scheme.income_limit !== undefined) {
    if (profile.family_income === undefined || profile.family_income === null || profile.family_income === "") {
      missingInfo.push(`Family Income not specified (Scheme maximum limit is ₹${scheme.income_limit.toLocaleString('en-IN')})`);
    } else {
      const income = Number(profile.family_income);
      if (income <= scheme.income_limit) {
        metCriteria.push(`Income Limit: Citizen annual income ₹${income.toLocaleString('en-IN')} is within ceiling of ₹${scheme.income_limit.toLocaleString('en-IN')}`);
      } else {
        unmetCriteria.push(`Income Exceeded: Citizen annual income ₹${income.toLocaleString('en-IN')} exceeds threshold of ₹${scheme.income_limit.toLocaleString('en-IN')}`);
      }
    }
  } else {
    metCriteria.push("Income: No income cap specified for this scheme");
  }

  // 3. SOCIAL CATEGORY ELIGIBILITY
  if (scheme.category_eligible && !scheme.category_eligible.includes("All")) {
    if (!profile.category) {
      missingInfo.push(`Social Category not specified (Scheme eligible for: ${scheme.category_eligible.join(', ')})`);
    } else if (scheme.category_eligible.some(c => c.toLowerCase() === profile.category.toLowerCase())) {
      metCriteria.push(`Social Category: ${profile.category} is an eligible beneficiary category`);
    } else {
      unmetCriteria.push(`Social Category: Requires ${scheme.category_eligible.join('/')}, but citizen profile is ${profile.category}`);
    }
  } else {
    metCriteria.push("Category: All social categories (General / OBC / SC / ST / EWS) eligible");
  }

  // 4. GENDER ELIGIBILITY
  if (scheme.gender_eligible && scheme.gender_eligible !== "All") {
    if (!profile.gender) {
      missingInfo.push(`Gender not specified (Scheme is restricted to ${scheme.gender_eligible})`);
    } else if (profile.gender.toLowerCase() === scheme.gender_eligible.toLowerCase()) {
      metCriteria.push(`Gender: Matches ${scheme.gender_eligible}`);
    } else {
      unmetCriteria.push(`Gender: Scheme is exclusively for ${scheme.gender_eligible}, profile indicates ${profile.gender}`);
    }
  }

  // 5. AGE ELIGIBILITY
  if (scheme.min_age || scheme.max_age) {
    if (profile.age === undefined || profile.age === null) {
      // Don't fail if age is not given, list under missing if needed
    } else {
      const age = Number(profile.age);
      if (scheme.min_age && age < scheme.min_age) {
        unmetCriteria.push(`Age: Minimum age requirement is ${scheme.min_age} years (Citizen is ${age})`);
      } else if (scheme.max_age && age > scheme.max_age) {
        unmetCriteria.push(`Age: Maximum age limit is ${scheme.max_age} years (Citizen is ${age})`);
      } else {
        metCriteria.push(`Age: ${age} years is within prescribed range (${scheme.min_age || 0} - ${scheme.max_age || 100})`);
      }
    }
  }

  // 6. EDUCATION LEVEL ELIGIBILITY
  if (scheme.education_level && !scheme.education_level.includes("All")) {
    if (!profile.education_level && !profile.education) {
      missingInfo.push(`Education level not provided (Eligible: ${scheme.education_level.join(', ')})`);
    } else {
      const edu = (profile.education_level || profile.education || '').toLowerCase();
      const matched = scheme.education_level.some(e => edu.includes(e.toLowerCase()) || e.toLowerCase().includes(edu));
      if (matched) {
        metCriteria.push(`Education Level: ${profile.education_level || profile.education} is eligible`);
      } else {
        unmetCriteria.push(`Education Level: Requires ${scheme.education_level.join(' / ')}, citizen has ${profile.education_level || profile.education}`);
      }
    }
  }

  // DETERMINISTIC 3-TIER CLASSIFICATION
  let status = "Eligible";
  let badgeColor = "success"; // green
  let summary = "";

  if (unmetCriteria.length > 0) {
    status = "Not Eligible";
    badgeColor = "danger"; // red
    summary = `Citizen does not meet ${unmetCriteria.length} statutory condition(s): ${unmetCriteria[0]}`;
  } else if (missingInfo.length > 0) {
    status = "Potentially Eligible";
    badgeColor = "warning"; // amber
    summary = `Likely eligible based on available data, but requires verification of ${missingInfo.length} missing detail(s): ${missingInfo[0]}`;
  } else {
    status = "Eligible";
    badgeColor = "success";
    summary = "Citizen fully satisfies all statutory criteria for this scheme.";
  }

  return {
    scheme_id: scheme.id,
    scheme_name: scheme.name,
    status, // "Eligible" | "Potentially Eligible" | "Not Eligible"
    badgeColor,
    summary,
    metCriteria,
    unmetCriteria,
    missingInfo,
    benefits: scheme.benefits,
    official_url: scheme.official_url,
    guideline_url: scheme.guideline_url,
    deadline: scheme.application_deadline
  };
}

module.exports = {
  evaluateNationalEligibility
};

