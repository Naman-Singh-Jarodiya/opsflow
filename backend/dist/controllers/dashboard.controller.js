import { getDashboard } from '../services/dashboard.service.js';
export async function getDashboardController(req, res) {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const dashboard = await getDashboard(req.user.id);
    res.status(200).json({
        success: true,
        ...dashboard,
    });
}
//# sourceMappingURL=dashboard.controller.js.map