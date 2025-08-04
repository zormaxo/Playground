﻿namespace Analision.Maui.Core.Helpers;

public static class CurrentApplicationCloser
{
    public static void Quit()
    {
#if IOS
        System.Environment.Exit(0); 
#else
        Application.Current.Quit();

#endif
    }
}