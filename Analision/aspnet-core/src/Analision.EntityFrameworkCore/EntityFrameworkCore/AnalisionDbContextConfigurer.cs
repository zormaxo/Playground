using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace Analision.EntityFrameworkCore;

public static class AnalisionDbContextConfigurer
{
    public static void Configure(DbContextOptionsBuilder<AnalisionDbContext> builder, string connectionString)
    {
        builder.UseSqlServer(connectionString);
    }

    public static void Configure(DbContextOptionsBuilder<AnalisionDbContext> builder, DbConnection connection)
    {
        builder.UseSqlServer(connection);
    }
}

