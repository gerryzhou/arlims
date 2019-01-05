package gov.fda.nctr.arlims.data_access.facts;

import java.io.IOException;
import java.time.LocalDate;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.node.TextNode;


public class JsonTimestampToLocalDateDeserializer extends JsonDeserializer<LocalDate>
{
    @Override
    public LocalDate deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException
    {
        TextNode node = jp.getCodec().readTree(jp);
        String dateString = node.textValue();

        int spaceIx = dateString.indexOf(' ');
        if ( spaceIx == -1 )
            return LocalDate.parse(dateString);
        else
            return LocalDate.parse(dateString.substring(0, spaceIx));
    }
}
