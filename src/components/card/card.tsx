// src/components/card/Card.tsx
import React from "react";
import styled from "styled-components";

interface CardProps {
  title: string;
  value: string | number;
}

const CardContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow};
  text-align: center;

  h3 {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.9rem;
    font-weight: 500;
  }

  p {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.8rem;
    font-weight: 700;
    margin-top: 8px;
  }
`;

const Card: React.FC<CardProps> = ({ title, value }) => (
  <CardContainer>
    <h3>{title}</h3>
    <p>{value}</p>
  </CardContainer>
);

export default Card;
