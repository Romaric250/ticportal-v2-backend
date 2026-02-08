import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import type { UserRole } from "@prisma/client";
import { logger } from "../utils/logger";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn({ 
      url: req.url, 
      method: req.method,
      hasAuthHeader: !!authHeader,
      authHeaderPreview: authHeader ? authHeader.substring(0, 20) + '...' : 'none'
    }, 'Authentication failed: Missing or invalid Authorization header');
    
    return res.status(401).json({ 
      success: false, 
      error: { 
        message: "Unauthorized - Missing or invalid Authorization header",
        hint: "Include 'Authorization: Bearer <token>' in request headers"
      } 
    });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const payload = verifyAccessToken(token);
    // Normalize payload - JWT has userId and role, but some code expects id
    (req as any).user = {
      ...payload,
      id: payload.userId || payload.id, // Support both userId and id
      userId: payload.userId || payload.id // Ensure userId is set
    };
    
    logger.debug({ 
      userId: payload.userId || payload.id, 
      userRole: payload.role,
      url: req.url 
    }, 'User authenticated successfully');
    
    next();
  } catch (error: any) {
    logger.warn({ 
      url: req.url, 
      error: error.message 
    }, 'Authentication failed: Invalid or expired token');
    
    res.status(401).json({ 
      success: false, 
      error: { 
        message: "Invalid or expired token",
        hint: "Please login again to get a new token"
      } 
    });
  }
};

/**
 * Authorize middleware - checks if user has required role
 */
export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      logger.warn({ url: req.url }, 'Authorization failed: No user in request');
      return res.status(401).json({ 
        success: false, 
        error: { message: "Unauthorized - No user found in request" } 
      });
    }

    // Normalize role - JWT payload has userId and role
    const userRole = user.role;
    
    logger.debug({ 
      userId: user.userId || user.id, 
      userRole: userRole, 
      allowedRoles,
      url: req.url,
      fullUser: user
    }, 'Checking user authorization');

    if (!userRole || !allowedRoles.includes(userRole)) {
      logger.warn({ 
        userId: user.userId || user.id, 
        userRole: userRole, 
        allowedRoles,
        url: req.url,
        fullUser: user
      }, 'Authorization failed: Insufficient permissions');
      
      return res.status(403).json({
        success: false,
        error: { 
          message: "Forbidden - insufficient permissions",
          hint: `Required role(s): ${allowedRoles.join(', ')}`
        },
      });
    }

    next();
  };
};