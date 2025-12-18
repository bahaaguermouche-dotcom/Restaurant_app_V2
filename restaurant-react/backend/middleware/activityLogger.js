import { ActivityLog } from '../models/index.js';

/**
 * Middleware to log user activities
 * @param {string} action - The action name (e.g., 'LOGIN', 'CREATE_ORDER')
 * @param {string} entityType - The entity type (e.g., 'USER', 'ORDER')
 * @param {function} getEntityId - Optional function to extract entity ID from request
 */
export const logActivity = (action, entityType = null, getEntityId = null) => {
    return async (req, res, next) => {
        // Capture the original end function
        const originalEnd = res.end;

        // Override end function to log after response is sent
        res.end = async function (chunk, encoding) {
            // Restore original end
            res.end = originalEnd;
            res.end(chunk, encoding);

            // Only log successful requests (status 2xx)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                try {
                    const userId = req.user ? req.user.id : null;
                    let entityId = null;

                    if (getEntityId) {
                        entityId = getEntityId(req, res);
                    } else if (req.params.id) {
                        entityId = req.params.id;
                    }

                    // Extract IP address
                    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

                    await ActivityLog.create({
                        user_id: userId,
                        action,
                        entity_type: entityType,
                        entity_id: entityId,
                        ip_address: ipAddress, // Store IP address
                        details: JSON.stringify({
                            url: req.originalUrl,
                            method: req.method,
                            body: req.method !== 'GET' ? req.body : undefined,
                        }),
                    });
                } catch (error) {
                    console.error('Error logging activity:', error);
                }
            }
        };

        next();
    };
};

// Helper for manual logging
export const createLog = async (userId, action, entityType, entityId, details, req = null) => {
    try {
        const ipAddress = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress) : null;

        await ActivityLog.create({
            user_id: userId,
            action,
            entity_type: entityType,
            entity_id: entityId,
            ip_address: ipAddress,
            details: typeof details === 'string' ? details : JSON.stringify(details),
        });
    } catch (error) {
        console.error('Manual log error:', error);
    }
};
