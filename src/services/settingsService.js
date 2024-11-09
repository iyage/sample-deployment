import { generateUrlQuery } from "helpers/utils";
import { authService } from "./authService";

export const settingsService = {
    createRole: async (data) =>
        await authService.apiClient().post(`/api/v1/freight-forwarder/roles`, data),
    updateRole: async (roleId, data) =>
        await authService.apiClient().put(`/api/v1/freight-forwarder/roles/${roleId}`, data),
    deleteRole: async (data) =>
        await authService.apiClient().delete(`/api/v1/freight-forwarder/roles`, data),
    getRoles: async (parentId) =>
        await authService.apiClient().get(`/api/v1/freight-forwarder/roles?parentId=${parentId}`),
    getRole: async ({ roleId = "", roleName = "" }) =>
        await authService
            .apiClient()
            .get(`/api/v1/freight-forwarder/roles/role?${generateUrlQuery({ roleId, roleName })}`),
    addTeamMember: async (data) =>
        await authService.apiClient().post(`/api/v1/freight-forwarder/team`, data),
    fetchTeamMembers: async (page) =>
        await authService.apiClient().get(`/api/v1/freight-forwarder/team?page=${page}`),
    deleteTeamMember: async (id) =>
        await authService.apiClient().delete(`/api/v1/freight-forwarder/team/${id}`),
    updateTeamMember: async (id, data) =>
        await authService.apiClient().put(`/api/v1/freight-forwarder/team/${id}`, data),
    getWallet: async (currency) =>
        await authService.apiClient().get(`/api/v1/freight-forwarder/wallet?currency=${currency}`),
    getWalletHistory: async ({ walletId, page = 1 }) =>
        await authService
            .apiClient()
            .get(`/api/v1/freight-forwarder/wallet/history/${walletId}?page=${page}`),
    fundWallet: async (data) =>
        await authService.apiClient().post(`/api/v1/freight-forwarder/wallet/fund`, data),
};
