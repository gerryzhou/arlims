package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;

public class Signature
{
    private Instant signed;
    private Analyst signer;

    public Signature
    (
        Instant signed,
        Analyst signer
    )
    {
        this.signed = signed;
        this.signer = signer;
    }
}
