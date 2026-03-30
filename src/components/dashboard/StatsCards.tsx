"use client"

import { TrendingUp, DollarSign, Clock, X } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface ChartDataItem {
  month?: string;
  day?: string;
  completed?: number;
  ongoing?: number;
  pending?: number;
  total?: number;
  received?: number;
  pendingPayment?: number;
  classes?: number;
}

interface TableDataItem {
  id: number;
  name?: string;
  status?: string;
  progress?: number;
  amount?: number;
  project?: string;
  date?: string;
  type?: string;
  [key: string]: string | number | undefined;
}

interface PopupData {
  type: "projects" | "payment" | "activities";
  title: string;
  data: {
    chartData: ChartDataItem[];
    tableData: TableDataItem[];
  };
  stats: {
    completedProjects?: number;
    totalProjects?: number;
    totalPayment?: number;
    totalValue?: number;
    percentage?: number;
    activeClasses?: number;
  };
}

interface StatsCardsProps {
  totalProjects?: number;
  completedProjects?: number;
  totalPayment?: number;
  totalValue?: number;
  activeClasses?: number;
  activeTab?: "projects" | "classes";
  projectsChartData?: ChartDataItem[];
  paymentChartData?: ChartDataItem[];
  activitiesChartData?: ChartDataItem[];
  projectsTableData?: TableDataItem[];
  paymentTableData?: TableDataItem[];
  activitiesTableData?: TableDataItem[];
  allProjects?: unknown[];
  allClasses?: unknown[];
}

export function StatsCards({
  totalProjects = 0,
  completedProjects = 0,
  totalPayment = 0,
  totalValue = 0,
  activeClasses = 0,
  activeTab = "projects",
  projectsChartData = [],
  paymentChartData = [],
  activitiesChartData = [],
  projectsTableData = [],
  paymentTableData = [],
  activitiesTableData = [],
}: StatsCardsProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState<PopupData | null>(null);

  const colorMap = {
    projects: "#12498b",
    classes: "#b12222"
  };

  const activeColor = colorMap[activeTab as keyof typeof colorMap] || "#12498b";

  const getPopupData = (type: string, title: string, stats: PopupData['stats']) => {
    const baseData = {
      projects: {
        chartData: projectsChartData.length > 0 ? projectsChartData : [
          { month: 'Jan', completed: 0, ongoing: 0, pending: 0, total: 0 }
        ],
        tableData: projectsTableData.length > 0 ? projectsTableData : [
          { id: 1, name: 'No projects', status: 'N/A', progress: 0, amount: 0 }
        ]
      },
      payment: {
        chartData: paymentChartData.length > 0 ? paymentChartData : [
          { month: 'Jan', received: 0, pending: 0 }
        ],
        tableData: paymentTableData.length > 0 ? paymentTableData : [
          { id: 1, project: 'No payments', amount: 0, status: 'N/A', date: 'N/A' }
        ]
      },
      activities: {
        chartData: activitiesChartData.length > 0 ? activitiesChartData : [
          { day: 'Mon', classes: 0 }
        ],
        tableData: activitiesTableData.length > 0 ? activitiesTableData : [
          { id: 1, name: 'No activities', type: 'N/A', date: 'N/A' }
        ]
      }
    };

    return {
      type: type as "projects" | "payment" | "activities",
      title,
      data: baseData[type as keyof typeof baseData],
      stats
    };
  };

  const handleCardClick = (type: string, title: string, stats: PopupData['stats']) => {
    setPopupData(getPopupData(type, title, stats));
    setShowPopup(true);
  };

  const projectCompletionPercentage = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;
  const paymentCollectionPercentage = totalValue > 0 ? Math.round((totalPayment / totalValue) * 100) : 0;

  const statsData = [
    {
      title: activeTab === "projects" ? "Total Projects" : "Total Classes",
      value: activeTab === "projects" ? totalProjects.toString() : activeClasses.toString(),
      subtitle: activeTab === "projects" ? `${completedProjects} completed` : "Scheduled sessions",
      footer: "Click to view details",
      icon: TrendingUp,
      percentage: activeTab === "projects" ? projectCompletionPercentage : 100,
      type: "projects",
      clickText: "View Details",
      stats: {
        completedProjects: activeTab === "projects" ? completedProjects : activeClasses,
        totalProjects: activeTab === "projects" ? totalProjects : activeClasses,
        percentage: activeTab === "projects" ? projectCompletionPercentage : 100
      },
      visible: true
    },
    {
      title: "Total Payment",
      value: `₹${totalPayment.toLocaleString()}`,
      subtitle: `₹${totalValue.toLocaleString()} total value`,
      footer: "Click to view analytics",
      icon: DollarSign,
      percentage: paymentCollectionPercentage,
      type: "payment",
      clickText: "View Analytics",
      stats: {
        totalPayment,
        totalValue,
        percentage: paymentCollectionPercentage
      },
      visible: isAdmin
    },
    {
      title: activeTab === "classes" ? "Upcoming Classes" : "Active Items",
      value: activeTab === "classes" ? activeClasses.toString() : activeClasses.toString(),
      subtitle: activeTab === "classes" ? "Scheduled sessions" : "Managing schedules",
      footer: "View all items",
      icon: Clock,
      percentage: 100,
      type: "activities",
      clickText: "View Schedule",
      stats: {
        completedProjects: activeClasses,
        activeClasses: activeClasses,
        percentage: 100
      },
      visible: true
    }
  ].filter(stat => stat.visible);

  const renderChart = (data: PopupData['data'], type: string) => {
    if (!data.chartData || data.chartData.length === 0) {
      return (
        <div className="mt-4 text-center py-8 text-gray-500">
          No data available for chart
        </div>
      );
    }

    const maxValue = Math.max(
      ...data.chartData.flatMap((item: ChartDataItem) => {
        if (type === 'projects') return [item.completed || 0, item.ongoing || 0, item.pending || 0, item.total || 0];
        if (type === 'payment') return [item.received || 0, item.pendingPayment || 0];
        if (type === 'activities') return [item.classes || 0];
        return [0];
      }),
      1
    );

    return (
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-3">
          {type === 'projects' ? 'Monthly Project Overview' :
            type === 'payment' ? 'Monthly Payment Overview' : 'Weekly Activities Overview'}
        </h4>
        <div className="flex items-end justify-between h-32 gap-2">
          {data.chartData.map((item: ChartDataItem, index: number) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex items-end justify-center gap-1 h-20 w-full">
                {type === 'projects' && (
                  <>
                    <div
                      className="w-3 bg-green-500 rounded-t transition-all duration-300 hover:opacity-80"
                      style={{ height: `${((item.completed || 0) / maxValue) * 70}px` }}
                      title={`Completed: ${item.completed}`}
                    />
                    <div
                      className="w-3 bg-blue-500 rounded-t transition-all duration-300 hover:opacity-80"
                      style={{ height: `${((item.ongoing || 0) / maxValue) * 70}px` }}
                      title={`Ongoing: ${item.ongoing}`}
                    />
                    <div
                      className="w-3 bg-gray-400 rounded-t transition-all duration-300 hover:opacity-80"
                      style={{ height: `${((item.pending || 0) / maxValue) * 70}px` }}
                      title={`Pending: ${item.pending}`}
                    />
                  </>
                )}
                {type === 'payment' && (
                  <>
                    <div
                      className="w-4 bg-green-500 rounded-t transition-all duration-300 hover:opacity-80"
                      style={{ height: `${((item.received || 0) / maxValue) * 70}px` }}
                      title={`Received: ₹${(item.received || 0).toLocaleString()}`}
                    />
                    <div
                      className="w-4 bg-orange-500 rounded-t transition-all duration-300 hover:opacity-80"
                      style={{ height: `${((item.pendingPayment || 0) / maxValue) * 70}px` }}
                      title={`Pending: ₹${(item.pendingPayment || 0).toLocaleString()}`}
                    />
                  </>
                )}
                {type === 'activities' && (
                  <>
                    <div
                      className="w-4 bg-purple-500 rounded-t transition-all duration-300 hover:opacity-80"
                      style={{ height: `${((item.classes || 0) / maxValue) * 70}px` }}
                      title={`Classes: ${item.classes}`}
                    />
                  </>
                )}
              </div>
              <span className="text-xs mt-2 text-gray-600 dark:text-gray-400 font-medium">{item.month || item.day}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4 mt-3 text-xs">
          {type === 'projects' && (
            <>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Ongoing</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-400 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Pending</span>
              </div>
            </>
          )}
          {type === 'payment' && (
            <>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Received</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Pending</span>
              </div>
            </>
          )}
          {type === 'activities' && (
            <>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Classes</span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderTable = (data: PopupData['data']) => {
    if (!data.tableData || data.tableData.length === 0) {
      return (
        <div className="mt-6 text-center py-4 text-gray-500">
          No data available
        </div>
      );
    }

    const headers = Object.keys(data.tableData[0]).filter(key => key !== 'id');

    return (
      <div className="mt-6">
        <h4 className="text-sm font-semibold mb-3">Recent Items</h4>
        <div className="overflow-x-auto border rounded-lg dark:border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-800">
                {headers.map((key) => (
                  <th key={key} className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.tableData.map((row: TableDataItem, index: number) => (
                <tr key={index} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  {headers.map((key, cellIndex) => (
                    <td key={cellIndex} className="py-2 px-4 text-gray-600 dark:text-gray-400">
                      {key === 'amount' ? `₹${row[key]?.toLocaleString()}` :
                        key === 'progress' ? `${row[key]}%` : row[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg cursor-pointer bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                onClick={() => handleCardClick(stat.type, stat.title, stat.stats)}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, transparent, ${activeColor}08)`
                  }}
                />

                <div className="relative p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">
                        {stat.title}
                      </h3>
                    </div>
                    <div
                      className="ml-3 p-2.5 rounded-lg transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${activeColor}15`,
                        color: activeColor
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div
                      className="text-2xl sm:text-3xl font-bold mb-1"
                      style={{ color: activeColor }}
                    >
                      {stat.value}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.subtitle}
                    </p>
                  </div>

                  <div className="mb-3 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${stat.percentage}%`,
                        backgroundColor: activeColor
                      }}
                    />
                  </div>

                  <div className="w-full text-left">
                    <p
                      className="text-xs font-medium transition-colors hover:underline"
                      style={{ color: activeColor }}
                    >
                      {stat.clickText} →
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showPopup && popupData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border dark:border-gray-800">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-6 py-4 flex justify-between items-center rounded-t-xl z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {popupData.title} Analysis
              </h2>
              <button
                onClick={() => setShowPopup(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {renderChart(popupData.data, popupData.type)}
              {renderTable(popupData.data)}

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                {popupData.type === 'projects' && (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{popupData.stats.completedProjects}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{(popupData.stats.totalProjects || 0) - (popupData.stats.completedProjects || 0)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ongoing</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{popupData.stats.totalProjects}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: activeColor }}>{popupData.stats.percentage}%</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rate</div>
                    </div>
                  </>
                )}
                {popupData.type === 'payment' && (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">₹{(popupData.stats.totalPayment || 0).toLocaleString()}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Received</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">₹{((popupData.stats.totalValue || 0) - (popupData.stats.totalPayment || 0)).toLocaleString()}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">₹{(popupData.stats.totalValue || 0).toLocaleString()}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: activeColor }}>{popupData.stats.percentage}%</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rate</div>
                    </div>
                  </>
                )}
                {popupData.type === 'activities' && (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{popupData.stats.activeClasses}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Classes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{popupData.stats.activeClasses}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}