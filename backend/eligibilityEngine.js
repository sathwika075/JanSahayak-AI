// C:\Nxtwave-Sathwika\jansahayak-ai\backend\eligibilityEngine.js
// Deterministic Python/JS Eligibility Engine
// Does NOT let LLM fabricate eligibility. Evaluates hard mathematical and categorical rules.

function evaluateEligibility(studentProfile, scheme) {
  const matchingCriteria = [];
  const unmetCriteria = [];
  const unknownCriteria = [];

  // 1. Income Limit Check
  if (scheme.income_limit !== null && scheme.income_limit !== undefined) {
    if (studentProfile.family_income !== null && studentProfile.family_income !== undefined && studentProfile.family_income !== "") {
      const studentIncome = Number(studentProfile.family_income);
      if (studentIncome <= scheme.income_limit) {
        matchingCriteria.push({
          criterion: "Annual Family Income",
          details: `Your income (₹${studentIncome.toLocaleString('en-IN')}) is within the allowed ceiling of ₹${scheme.income_limit.toLocaleString('en-IN')}.`,
          status: "PASSED"
        });
      } else {
        unmetCriteria.push({
          criterion: "Annual Family Income Limit Exceeded",
          details: `Your income (₹${studentIncome.toLocaleString('en-IN')}) exceeds the ceiling of ₹${scheme.income_limit.toLocaleString('en-IN')}.`,
          status: "FAILED"
        });
      }
    } else {
      unknownCriteria.push({
        criterion: "Annual Family Income",
        details: `Income ceiling is ₹${scheme.income_limit.toLocaleString('en-IN')}. Your family income is not specified in profile.`,
        status: "UNKNOWN"
      });
    }
  }

  // 2. Category Check
  if (scheme.category_eligible && scheme.category_eligible.length > 0 && !scheme.category_eligible.includes("All")) {
    if (studentProfile.category) {
      const studentCat = studentProfile.category.trim().toUpperCase();
      const matches = scheme.category_eligible.some(c => c.toUpperCase().includes(studentCat) || studentCat.includes(c.toUpperCase()));
      if (matches) {
        matchingCriteria.push({
          criterion: "Social Category / Reservation",
          details: `Your category (${studentProfile.category}) matches eligible reservation categories: [${scheme.category_eligible.join(", ")}].`,
          status: "PASSED"
        });
      } else {
        unmetCriteria.push({
          criterion: "Social Category Ineligible",
          details: `Scheme is designated specifically for [${scheme.category_eligible.join(", ")}]. Your recorded category is ${studentProfile.category}.`,
          status: "FAILED"
        });
      }
    } else {
      unknownCriteria.push({
        criterion: "Social Category",
        details: `Scheme is limited to [${scheme.category_eligible.join(", ")}]. Your category is not set in your profile.`,
        status: "UNKNOWN"
      });
    }
  } else {
    matchingCriteria.push({
      criterion: "Category Eligibility",
      details: "Open to all social categories and communities.",
      status: "PASSED"
    });
  }

  // 3. State / Domicile Check
  if (scheme.state && scheme.state !== "All India (Central)") {
    if (studentProfile.state) {
      if (studentProfile.state.toLowerCase() === scheme.state.toLowerCase()) {
        matchingCriteria.push({
          criterion: "State Domicile",
          details: `You are residing in ${studentProfile.state}, which satisfies the state domicile requirement.`,
          status: "PASSED"
        });
      } else {
        unmetCriteria.push({
          criterion: "State Domicile Mismatch",
          details: `Scheme requires domicile in ${scheme.state}, but your profile state is ${studentProfile.state}.`,
          status: "FAILED"
        });
      }
    } else {
      unknownCriteria.push({
        criterion: "State Domicile",
        details: `Requires state domicile in ${scheme.state}. Please update your state.`,
        status: "UNKNOWN"
      });
    }
  } else {
    matchingCriteria.push({
      criterion: "National Eligibility",
      details: "Available for students across all Indian States and Union Territories.",
      status: "PASSED"
    });
  }

  // 4. Education Level Check
  if (scheme.education_level && scheme.education_level.length > 0) {
    if (studentProfile.education_level) {
      const eduMatches = scheme.education_level.some(lvl => 
        lvl.toLowerCase().includes(studentProfile.education_level.toLowerCase()) || 
        studentProfile.education_level.toLowerCase().includes(lvl.toLowerCase()) ||
        lvl === "All"
      );
      if (eduMatches) {
        matchingCriteria.push({
          criterion: "Education Level",
          details: `Your current level (${studentProfile.education_level}) matches eligible education tiers.`,
          status: "PASSED"
        });
      } else {
        unmetCriteria.push({
          criterion: "Education Level Requirement",
          details: `Scheme is meant for [${scheme.education_level.join(", ")}], but your profile indicates ${studentProfile.education_level}.`,
          status: "FAILED"
        });
      }
    } else {
      unknownCriteria.push({
        criterion: "Education Level",
        details: `Requires [${scheme.education_level.join(", ")}]. Your profile has no education level specified.`,
        status: "UNKNOWN"
      });
    }
  }

  // 5. Academic Marks / CGPA Check
  if (scheme.min_cgpa_or_marks && scheme.min_cgpa_or_marks > 0) {
    if (studentProfile.academic_marks !== null && studentProfile.academic_marks !== undefined && studentProfile.academic_marks !== "") {
      const marks = Number(studentProfile.academic_marks);
      if (marks >= scheme.min_cgpa_or_marks) {
        matchingCriteria.push({
          criterion: "Academic Merit",
          details: `Your academic score (${marks}%) meets the minimum threshold of ${scheme.min_cgpa_or_marks}%.`,
          status: "PASSED"
        });
      } else {
        unmetCriteria.push({
          criterion: "Academic Merit Not Met",
          details: `Your score (${marks}%) is below the required cutoff of ${scheme.min_cgpa_or_marks}%.`,
          status: "FAILED"
        });
      }
    } else {
      unknownCriteria.push({
        criterion: "Academic Merit",
        details: `Requires minimum ${scheme.min_cgpa_or_marks}% marks. Your academic marks are not provided.`,
        status: "UNKNOWN"
      });
    }
  }

  // 6. Gender Restriction Check
  if (scheme.gender_restriction) {
    if (studentProfile.gender) {
      if (studentProfile.gender.toLowerCase() === scheme.gender_restriction.toLowerCase()) {
        matchingCriteria.push({
          criterion: "Gender Requirement",
          details: `Matches the designated scheme gender criteria (${scheme.gender_restriction}).`,
          status: "PASSED"
        });
      } else {
        unmetCriteria.push({
          criterion: "Gender Restriction",
          details: `Scheme is exclusively for ${scheme.gender_restriction} students.`,
          status: "FAILED"
        });
      }
    } else {
      unknownCriteria.push({
        criterion: "Gender Requirement",
        details: `Exclusively for ${scheme.gender_restriction} students. Your profile does not specify gender.`,
        status: "UNKNOWN"
      });
    }
  }

  // Calculate Verdict
  let status = "Eligible based on available criteria";
  let badgeColor = "green";
  let explanation = "";

  if (unmetCriteria.length > 0) {
    status = "Not eligible based on documented criteria";
    badgeColor = "red";
    explanation = `You do not satisfy ${unmetCriteria.length} essential requirement(s): ${unmetCriteria.map(u => u.criterion).join(", ")}.`;
  } else if (unknownCriteria.length > 0) {
    status = "Potentially eligible (Additional information required)";
    badgeColor = "amber";
    explanation = `You meet ${matchingCriteria.length} known criteria, but ${unknownCriteria.length} requirement(s) need confirmation: ${unknownCriteria.map(u => u.criterion).join(", ")}.`;
  } else {
    status = "Fully Eligible based on verified criteria";
    badgeColor = "green";
    explanation = `Congratulations! You meet all ${matchingCriteria.length} verified government conditions for this scheme.`;
  }

  return {
    scheme_id: scheme.id,
    scheme_name: scheme.name,
    status,
    badgeColor,
    explanation,
    matchingCriteria,
    unmetCriteria,
    unknownCriteria,
    official_url: scheme.official_url,
    application_deadline: scheme.application_deadline,
    required_documents: scheme.required_documents
  };
}

module.exports = { evaluateEligibility };
