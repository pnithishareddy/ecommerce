
function Overview({ products, orders, customers }) {
  const ok = orders.filter((o) => o.status !== "Cancelled");
  const rev = ok.reduce((sum, o) => sum + Number(o.total || 0), 0);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May",
    "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ].map((month, index) => ({
    label: month,
    v: ok
      .filter((o) => Number(o.date.slice(5, 7)) === index + 1)
      .reduce((sum, o) => sum + Number(o.total || 0), 0),
  }));

  const currentMonth = new Date().getMonth();
  const previousMonth = (currentMonth + 11) % 12;

  const currentRevenue = months[currentMonth].v;
  const previousRevenue = months[previousMonth].v;

  const revenueChange =
    previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : null;

  const cityOf = (name) =>
    (customers.find((customer) => customer.name === name) || {}).city;

  const city = CITIES.map((name) => ({
    label: name,
    v: ok
      .filter((order) => cityOf(order.customer) === name)
      .reduce((sum, order) => sum + Number(order.total || 0), 0),
  }))
    .filter((item) => item.v > 0)
    .sort((a, b) => b.v - a.v);

  const totalOrders = orders.length;
  const completedOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;
  const lowStock = products.filter(
    (product) => Number(product.stock) < 10
  ).length;

  const stats = [
    {
      icon: "payments",
      label: "Total Revenue",
      value: inr(rev),
      note: "Excluding cancelled orders",
    },
    {
      icon: "orders",
      label: "Total Orders",
      value: totalOrders.toLocaleString("en-IN"),
      note: `${completedOrders} delivered`,
    },
    {
      icon: "customers",
      label: "Total Customers",
      value: customers.length.toLocaleString("en-IN"),
      note: "Registered customers",
    },
    {
      icon: "alert",
      label: "Low Stock Products",
      value: lowStock.toLocaleString("en-IN"),
      note: "Products with stock below 10",
    },
  ];

  const statusColors = {
    Pending: "#f59e0b",
    Processing: "#8b5cf6",
    Shipped: "#3b82f6",
    Delivered: "#10b981",
    Cancelled: "#ef4444",
  };

  const statusData = ST.map((status) => {
    const count = orders.filter(
      (order) => order.status === status
    ).length;

    return {
      label: status,
      count,
      percentage: totalOrders
        ? (count / totalOrders) * 100
        : 0,
      color: statusColors[status] || "#94a3b8",
    };
  });

  const highestCity = city[0];
  const totalCityRevenue = city.reduce(
    (sum, item) => sum + item.v,
    0
  );

  return html`
    <div class="overview-dashboard">
      <div class="grid">
        ${stats.map(
          (stat) => html`
            <div class="card stat" key=${stat.label}>
              <div class="ic">
                <${Ic} n=${stat.icon} />
              </div>
              <div class="stat-content">
                <span>${stat.label}</span>
                <b>${stat.value}</b>
                <small class="stat-note">${stat.note}</small>
              </div>
            </div>
          `
        )}
      </div>

      <div class="overview-insights">
        <div class="card insight-card">
          <div class="insight-icon revenue-insight-icon">₹</div>
          <div>
            <span class="insight-label">This Month's Revenue</span>
            <h3>${inr(currentRevenue)}</h3>
            <p class="sub">
              ${
                revenueChange === null
                  ? "No previous-month revenue to compare"
                  : `${revenueChange >= 0 ? "▲" : "▼"} ${Math.abs(
                      revenueChange
                    ).toFixed(1)}% ${
                      revenueChange >= 0 ? "increase" : "decrease"
                    } vs last month`
              }
            </p>
          </div>
        </div>

        <div class="card insight-card">
          <div class="insight-icon orders-insight-icon">✓</div>
          <div>
            <span class="insight-label">Delivery Rate</span>
            <h3>
              ${
                totalOrders
                  ? ((completedOrders / totalOrders) * 100).toFixed(1)
                  : "0.0"
              }%
            </h3>
            <p class="sub">Orders successfully delivered</p>
          </div>
        </div>

        <div class="card insight-card">
          <div class="insight-icon city-insight-icon">⌖</div>
          <div>
            <span class="insight-label">Top Revenue City</span>
            <h3>${highestCity ? highestCity.label : "No data"}</h3>
            <p class="sub">
              ${highestCity ? inr(highestCity.v) : "No city revenue available"}
            </p>
          </div>
        </div>
      </div>

      <div class="grid g2 overview-charts">
        <div class="card revenue-card">
          <div class="revenue-card-header">
            <div>
              <h3>Monthly Revenue</h3>
              <p class="sub">
                Revenue trends across the calendar year
              </p>
            </div>
            <span class="chart-tag">Revenue Trends</span>
          </div>

          <div class="chart-summary">
            <strong>${inr(rev)}</strong>
            <span class="sub">Total non-cancelled revenue</span>
          </div>

          <${HBarChart} data=${months} />
        </div>

        <div class="card revenue-card">
          <div class="revenue-card-header">
            <div>
              <h3>Revenue by City</h3>
              <p class="sub">
                Compare sales contribution by city
              </p>
            </div>
            <span class="chart-tag">City Insights</span>
          </div>

          <div class="chart-summary">
            <strong>${inr(totalCityRevenue)}</strong>
            <span class="sub">Revenue matched to customer cities</span>
          </div>

          ${
            city.length
              ? html`<${DonutChart} data=${city} />`
              : html`
                  <div class="chart-empty">
                    <span class="empty-chart-icon">◌</span>
                    <b>No city revenue available</b>
                    <p class="sub">
                      Revenue will appear when orders match customer cities.
                    </p>
                  </div>
                `
          }
        </div>

        <div class="card revenue-card status-card">
          <div class="revenue-card-header">
            <div>
              <h3>Orders by Status</h3>
              <p class="sub">
                Distribution of all orders by current status
              </p>
            </div>
            <span class="chart-tag">Order Health</span>
          </div>

          <div class="status-total">
            <div>
              <strong>${totalOrders}</strong>
              <span class="sub">Total orders</span>
            </div>
            <div>
              <strong>${completedOrders}</strong>
              <span class="sub">Delivered</span>
            </div>
          </div>

          <div class="status-list">
            ${statusData.map(
              (item) => html`
                <div class="status-item" key=${item.label}>
                  <div class="status-item-header">
                    <div class="status-name">
                      <span
                        class="status-dot"
                        style=${{ background: item.color }}
                      ></span>
                      <span>${item.label}</span>
                    </div>
                    <div class="status-values">
                      <b>${item.count}</b>
                      <span class="sub">
                        ${item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div class="prog status-progress">
                    <i
                      style=${{
                        width: item.percentage + "%",
                        background: item.color,
                      }}
                    ></i>
                  </div>
                </div>
              `
            )}
          </div>
        </div>

        <div class="card revenue-card city-ranking-card">
          <div class="revenue-card-header">
            <div>
              <h3>Top Performing Cities</h3>
              <p class="sub">
                Cities ranked by non-cancelled order revenue
              </p>
            </div>
            <span class="chart-tag">City Rankings</span>
          </div>

          ${
            city.length
              ? html`
                  <div class="city-ranking-list">
                    ${city.slice(0, 5).map(
                      (item, index) => {
                        const share = totalCityRevenue
                          ? (item.v / totalCityRevenue) * 100
                          : 0;

                        return html`
                          <div class="city-ranking-item" key=${item.label}>
                            <div class="city-ranking-heading">
                              <div class="city-ranking-name">
                                <span class="city-rank">
                                  ${index + 1}
                                </span>
                                <b>${item.label}</b>
                              </div>
                              <strong>${inr(item.v)}</strong>
                            </div>

                            <div class="prog city-ranking-progress">
                              <i
                                style=${{
                                  width: share + "%",
                                }}
                              ></i>
                            </div>

                            <span class="sub city-share">
                              ${share.toFixed(1)}% of matched city revenue
                            </span>
                          </div>
                        `;
                      }
                    )}
                  </div>
                `
              : html`
                  <div class="chart-empty">
                    <b>No city rankings yet</b>
                    <p class="sub">
                      Add orders linked to customers with city information.
                    </p>
                  </div>
                `
          }
        </div>
      </div>
    </div>
  `;
}
