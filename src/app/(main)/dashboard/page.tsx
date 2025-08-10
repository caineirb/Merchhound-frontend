import React from 'react'

const DashboardPage = () => {
  return (
    <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-secondary mt-2">Welcome to your MerchHound dashboard</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard content will go here */}
          <div className="bg-background p-6 rounded-lg shadow border border-border">
            <h3 className="text-lg font-medium text-foreground mb-2">Quick Stats</h3>
            <p className="text-secondary">Your dashboard content here</p>
          </div>
          
          <div className="bg-background p-6 rounded-lg shadow border border-border">
            <h3 className="text-lg font-medium text-foreground mb-2">Recent Orders</h3>
            <p className="text-secondary">Order tracking and management</p>
          </div>
          
          <div className="bg-background p-6 rounded-lg shadow border border-border">
            <h3 className="text-lg font-medium text-foreground mb-2">Inventory Overview</h3>
            <p className="text-secondary">Stock levels and alerts</p>
          </div>
        </div>
    </section>
  )
}

export default DashboardPage