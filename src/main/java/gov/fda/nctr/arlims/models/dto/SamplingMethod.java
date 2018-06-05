package gov.fda.nctr.arlims.models.dto;


public class SamplingMethod
{
    private String name;
    private String description;
    private int extractedGramsPerSub;
    private int numSubs;
    private int numComps;
    private int compositeGrams;
    private int numSubsPerComp;

    public SamplingMethod(String name, String description, int extractedGramsPerSub, int numSubs, int numComps, int compositeGrams, int numSubsPerComp)
    {
        this.name = name;
        this.description = description;
        this.extractedGramsPerSub = extractedGramsPerSub;
        this.numSubs = numSubs;
        this.numComps = numComps;
        this.compositeGrams = compositeGrams;
        this.numSubsPerComp = numSubsPerComp;
    }

    public String getName()
    {
        return name;
    }

    public String getDescription()
    {
        return description;
    }

    public int getExtractedGramsPerSub()
    {
        return extractedGramsPerSub;
    }

    public int getNumberOfSubs()
    {
        return numSubs;
    }

    public int getNumberOfComposites()
    {
        return numComps;
    }

    public int getCompositeMassGrams()
    {
        return compositeGrams;
    }

    public int getNumberOfSubsPerComposite()
    {
        return numSubsPerComp;
    }
}
