using System.Collections.Generic;

namespace Analision.DataExporting;

public interface IExcelColumnSelectionInput
{
    List<string> SelectedColumns { get; set; }
}

