package gov.fda.nctr.arlims.data_access.facts;

import java.io.IOException;
import java.time.LocalDate;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.node.TextNode;

/// Read a LocalDate from the initial part of a string of the form "yyyy/MM/dd[ |T].*]" such as
/// "2018-09-19 00:00:00.000-0400". The LABS DS api returns in several places timestamps such as the above for fields
/// that should be just dates. Everything after the first space or 'T' is ignored if present.
public class TimeIgnoringLocalDateDeserializer extends JsonDeserializer<LocalDate>
{
    @Override
    public LocalDate deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException
    {
        TextNode node = jp.getCodec().readTree(jp);

        String dateOrTimestampText = node.textValue();

        int sepIx = dateOrTimestampText.indexOf(' ');
        if ( sepIx == -1 )
            sepIx = dateOrTimestampText.indexOf('T');

        return sepIx == -1 ?
            LocalDate.parse(dateOrTimestampText)
            : LocalDate.parse(dateOrTimestampText.substring(0, sepIx));
    }
}
