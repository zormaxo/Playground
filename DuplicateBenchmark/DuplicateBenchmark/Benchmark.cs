using System.Collections.Generic;
using System.Linq;
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Configs;
using BenchmarkDotNet.Jobs;

namespace DuplicateBenchmark;

[MemoryDiagnoser]
[Config(typeof(FastConfig))]
public class Benchmark
{
    private int[]? _collection;

    [Params(100, 1000, 10000)]
    public int Size { get; set; }

    [Params(0.3, 0.6, 0.8)]
    public double DuplicateLocation { get; set; }

    [GlobalSetup]
    public void GlobalSetup()
    {
        _collection = Enumerable.Range(1, Size).ToArray();
        var index = (int)(DuplicateLocation * Size);
        _collection[index] = _collection[index + 1];
    }

    [Benchmark]
    public bool BruteForce() => ContainsDuplicates.BruteForce(_collection!);

    [Benchmark]
    public bool ForEach() => ContainsDuplicates.ForEach(_collection!);

    [Benchmark]
    public bool Any() => ContainsDuplicates.Any(_collection!);

    [Benchmark]
    public bool All() => ContainsDuplicates.All(_collection!);

    [Benchmark]
    public bool GroupBy() => ContainsDuplicates.GroupBy(_collection!);

    [Benchmark]
    public bool Distinct() => ContainsDuplicates.Distinct(_collection!);

    [Benchmark]
    public bool ToHashSet() => ContainsDuplicates.ToHashSet(_collection!);

    [Benchmark]
    public bool NewHashSet() => ContainsDuplicates.NewHashSet(_collection!);
}

public class FastConfig : ManualConfig
{
    public FastConfig()
    {
        AddJob(Job.Default.WithWarmupCount(1).WithIterationCount(3));
    }
}
