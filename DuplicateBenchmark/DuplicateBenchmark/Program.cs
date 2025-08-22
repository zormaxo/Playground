using BenchmarkDotNet.Running;

// See https://aka.ms/new-console-template for more information
Console.WriteLine("Hello, World!");

Console.WriteLine("Running duplicate detection benchmarks...");
BenchmarkRunner.Run<DuplicateBenchmark.Benchmark>();
