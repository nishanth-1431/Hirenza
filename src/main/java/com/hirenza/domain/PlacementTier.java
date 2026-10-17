package com.hirenza.domain;

/**
 * Campus Placement Tier Classification for institutional placement policies.
 * Used to enforce automated anti-seat-hogging rules and upgrade permissions.
 */
public enum PlacementTier {
    MASS_TIER("Mass / Core Tier", 3.0, 5.0),
    DREAM_TIER("Dream Tier", 5.0, 10.0),
    SUPER_DREAM_TIER("Super Dream / Product Tier", 10.0, 50.0);

    private final String displayName;
    private final double minLpa;
    private final double maxLpa;

    PlacementTier(String displayName, double minLpa, double maxLpa) {
        this.displayName = displayName;
        this.minLpa = minLpa;
        this.maxLpa = maxLpa;
    }

    public String getDisplayName() {
        return displayName;
    }

    public double getMinLpa() {
        return minLpa;
    }

    public double getMaxLpa() {
        return maxLpa;
    }

    public static PlacementTier fromCtc(double ctcLpa) {
        if (ctcLpa >= 10.0) {
            return SUPER_DREAM_TIER;
        } else if (ctcLpa >= 5.0) {
            return DREAM_TIER;
        } else {
            return MASS_TIER;
        }
    }
}
