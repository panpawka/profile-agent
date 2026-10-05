import { useCallback } from "react";
import { useQueryState } from "nuqs";
import type { ProfileData } from "@cli/src/types/profile";

const STORAGE_KEY = "profile-agent-data";
const STORAGE_STEP_KEY = "profile-agent-step";

/**
 * Custom hook for persisting profile data in localStorage and URL
 * - Stores profile data in localStorage for persistence across sessions
 * - Syncs compressed data to URL for shareable links
 * - Automatically restores data on mount
 */
export function useProfilePersistence() {
  // Use nuqs to manage URL state with base64 encoding
  const [urlData, setUrlData] = useQueryState("data", {
    defaultValue: "",
    parse: (value) => value,
    serialize: (value) => value,
    // Shallow routing to avoid page reloads
    shallow: true,
  });

  const [urlStep, setUrlStep] = useQueryState("step", {
    defaultValue: "",
    parse: (value) => value as "input" | "validation" | "preview" | "",
    serialize: (value) => value,
    shallow: true,
  });

  /**
   * Compress and encode profile data for URL storage
   */
  const encodeProfileData = useCallback((data: ProfileData): string => {
    try {
      const json = JSON.stringify(data);
      // Use base64 encoding for URL-safe storage
      if (typeof btoa !== "undefined") {
        return btoa(json);
      }
      return Buffer.from(json).toString("base64");
    } catch (error) {
      console.error("Failed to encode profile data:", error);
      return "";
    }
  }, []);

  /**
   * Decode and decompress profile data from URL
   */
  const decodeProfileData = useCallback((encoded: string): ProfileData | null => {
    try {
      if (!encoded) return null;
      let json = "";
      if (typeof atob !== "undefined") {
        json = atob(encoded);
      } else {
        json = Buffer.from(encoded, "base64").toString();
      }
      return JSON.parse(json) as ProfileData;
    } catch (error) {
      console.error("Failed to decode profile data:", error);
      return null;
    }
  }, []);

  /**
   * Load profile data from URL or localStorage
   */
  const loadProfileData = useCallback((): {
    data: ProfileData | null;
    step: "input" | "validation" | "preview";
  } => {
    if (typeof window === "undefined") return { data: null, step: "input" };

    // Priority 1: Try to load from URL
    if (urlData) {
      const decoded = decodeProfileData(urlData);
      if (decoded) {
        // Also save to localStorage for backup
        localStorage.setItem(STORAGE_KEY, JSON.stringify(decoded));
        return {
          data: decoded,
          step: (urlStep as "input" | "validation" | "preview") || "validation",
        };
      }
    }

    // Priority 2: Try to load from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedStep = localStorage.getItem(STORAGE_STEP_KEY);
      
      if (stored) {
        const data = JSON.parse(stored) as ProfileData;
        return {
          data,
          step: (storedStep as "input" | "validation" | "preview") || "validation",
        };
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
    }

    // No data found
    return { data: null, step: "input" };
  }, [urlData, urlStep, decodeProfileData]);

  /**
   * Save profile data to both localStorage and URL
   */
  const saveProfileData = useCallback(
    (data: ProfileData | null, step: "input" | "validation" | "preview") => {
      if (typeof window === "undefined") return;

      try {
        if (data) {
          // Save to localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          localStorage.setItem(STORAGE_STEP_KEY, step);

          // Save to URL (encoded)
          const encoded = encodeProfileData(data);
          setUrlData(encoded);
          setUrlStep(step);
        } else {
          // Clear all storage
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(STORAGE_STEP_KEY);
          setUrlData(null);
          setUrlStep(null);
        }
      } catch (error) {
        console.error("Failed to save profile data:", error);
      }
    },
    [encodeProfileData, setUrlData, setUrlStep]
  );

  /**
   * Clear all stored data
   */
  const clearProfileData = useCallback(() => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_STEP_KEY);
    setUrlData(null);
    setUrlStep(null);
  }, [setUrlData, setUrlStep]);

  /**
   * Check if there's existing data
   */
  const hasExistingData = useCallback((): boolean => {
    if (typeof window === "undefined") return false;

    if (urlData) return true;
    const stored = localStorage.getItem(STORAGE_KEY);
    return !!stored;
  }, [urlData]);

  return {
    loadProfileData,
    saveProfileData,
    clearProfileData,
    hasExistingData,
  };
}
