import React, { useState } from 'react';
import { Download, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table } from '../components/ui/Table';
import { mockAuditLogs } from '../data/mockData';
import { AuditLog, RiskLevel } from '../types';
import { formatDistanceToNow } from '../utils/dateUtils';

export function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'all'>('all');
  const [filterOutcome, setFilterOutcome] = useState<'all' | 'success' | 'failure' | 'pending'>('all');
  const [filterDateRange, setFilterDateRange] = useState('all');

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'success': return 'success';
      case 'failure': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const filteredLogs = mockAuditLogs.filter(log => {
    if (searchTerm && !log.action.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !log.details.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filterRisk !== 'all' && log.riskLevel !== filterRisk) return false;
    if (filterOutcome !== 'all' && log.outcome !== filterOutcome) return false;
    return true;
  });

  const exportToCsv = () => {
    const headers = ['Timestamp', 'Actor', 'Action', 'Type', 'Outcome', 'Risk Level', 'Details'];
    const csvData = [
      headers,
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toISOString(),
        log.agentName || log.userName || 'System',
        log.action,
        log.actionType,
        log.outcome,
        log.riskLevel,
        log.details
      ])
    ];
    
    const csvContent = csvData.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (log: AuditLog) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {new Date(log.timestamp).toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-500">
            {new Date(log.timestamp).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      key: 'actor',
      header: 'Actor',
      render: (log: AuditLog) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {log.agentName || log.userName || 'System'}
          </div>
          <Badge variant={log.agentName ? 'agent' : 'human'}>
            {log.agentName ? 'Agent' : 'Human'}
          </Badge>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (log: AuditLog) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {log.action}
          </div>
          <Badge variant="default">
            {log.actionType}
          </Badge>
        </div>
      ),
    },
    {
      key: 'outcome',
      header: 'Outcome',
      render: (log: AuditLog) => (
        <Badge variant={getOutcomeColor(log.outcome)}>
          {log.outcome}
        </Badge>
      ),
    },
    {
      key: 'riskLevel',
      header: 'Risk Level',
      render: (log: AuditLog) => (
        <Badge variant={getRiskColor(log.riskLevel)}>
          {log.riskLevel}
        </Badge>
      ),
    },
    {
      key: 'details',
      header: 'Details',
      render: (log: AuditLog) => (
        <div className="max-w-xs truncate text-sm text-gray-600 dark:text-gray-400">
          {log.details}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Audit Logs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete trace of all system actions and human overrides
          </p>
        </div>
        
        <Button variant="outline" icon={Download} onClick={exportToCsv}>
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search actions..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Risk Level
              </label>
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value as RiskLevel | 'all')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Outcome
              </label>
              <select
                value={filterOutcome}
                onChange={(e) => setFilterOutcome(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Outcomes</option>
                <option value="success">Success</option>
                <option value="failure">Failure</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <select
                value={filterDateRange}
                onChange={(e) => setFilterDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <Table
          data={filteredLogs}
          columns={columns}
          emptyMessage="No audit logs found"
        />
      </Card>
    </div>
  );
}