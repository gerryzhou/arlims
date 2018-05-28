package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;

public class Signature
{
    private Instant signed;
    private String signerId;

    public Signature
    (
        Instant signed,
        String signerId
    )
    {
        this.signed = signed;
        this.signerId = signerId;
    }
}
