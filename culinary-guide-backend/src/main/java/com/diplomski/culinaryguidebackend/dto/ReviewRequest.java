package com.diplomski.culinaryguidebackend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequest {
    private Integer rating;
    private String comment;
}