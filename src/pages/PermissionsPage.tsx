import React, { useState } from 'react';
import { Users, Shield, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockSystemSettings } from '../data/mockData';
import { SystemSettings, UserRole } from '../types';

export function PermissionsPage() {
  const [settings, setSettings] = useState<SystemSettings>(mockSystemSettings);

  const rolePermissions = {
    PM: ['create_requirements', 'edit_requirements', 'view_all', 'manage_permissions', 'approve_high_risk'],
    BA: ['create_requirements', 'edit_requirements', 'view_all'],
    Reviewer: ['view_all', 'approve_actions', 'escalate_actions'],
    Viewer: ['view_all'],
  };

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Permissions & Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage user roles and system behavior settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role-Based Access Control */}
        <Card>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Role-Based Access Control
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {Object.entries(rolePermissions).map(([role, permissions]) => (
              <div key={role} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="info" size="md">
                    {role}
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {permissions.length} permissions
                  </span>
                </div>
                <div className="space-y-2">
                  {permissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Behavior Settings */}
        <Card>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                System Behavior
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Auto-approve Safe Actions
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically approve low-risk agent actions
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoApproveSafeActions}
                  onChange={(e) => updateSetting('autoApproveSafeActions', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Require Human Review for Production DB
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Always require human approval for production database changes
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireHumanReviewForProdDB}
                  onChange={(e) => updateSetting('requireHumanReviewForProdDB', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Allow Agent Self-Delegation
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Allow agents to delegate tasks to other agents
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowAgentSelfDelegation}
                  onChange={(e) => updateSetting('allowAgentSelfDelegation', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Risk Level for Auto-Approval
              </label>
              <select
                value={settings.maxRiskLevelForAutoApproval}
                onChange={(e) => updateSetting('maxRiskLevelForAutoApproval', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Actions above this risk level will require human approval
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Save Settings */}
      <div className="flex justify-end">
        <Button variant="default">
          Save Settings
        </Button>
      </div>
    </div>
  );
}